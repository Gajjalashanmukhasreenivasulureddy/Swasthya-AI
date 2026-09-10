const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getAuthorizedCase } = require('./case.routes');
const { safeCreateNotification } = require('../services/notification.service');
const { success, failure } = require('../utils/response');

const router = express.Router();
const patientOnly = [authenticate, authorizeRoles('patient')];
const doctorOnly = [authenticate, authorizeRoles('doctor')];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const messageRateLimit = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many messages. Please try again shortly.' } });

function validUuid(value) {
  return typeof value === 'string' && uuidPattern.test(value);
}

function pageValues(request) {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 30);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) return null;
  return { page, limit, offset: (page - 1) * limit };
}

async function participants(caseId) {
  const result = await pool.query(
    `SELECT p.user_id AS patient_user_id, d.user_id AS doctor_user_id
     FROM patient_cases pc JOIN patients p ON p.id = pc.patient_id
     LEFT JOIN doctors d ON d.id = pc.assigned_doctor_id WHERE pc.id = $1`, [caseId]
  );
  return result.rows[0];
}

async function listMessages(request, response, next) {
  if (!validUuid(request.params.caseId)) return failure(response, 'Invalid case ID', 400);
  const paging = pageValues(request);
  if (!paging) return failure(response, 'page must be positive and limit must be between 1 and 100', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.caseId, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    const total = await pool.query('SELECT COUNT(*)::int AS total FROM case_conversations WHERE case_id = $1', [caseRecord.id]);
    const result = await pool.query(
      `SELECT id, sender_type, sender_user_id, message, created_at
       FROM case_conversations WHERE case_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
      [caseRecord.id, paging.limit, paging.offset]
    );
    return success(response, { messages: result.rows, page: paging.page, limit: paging.limit, total: total.rows[0].total, totalPages: Math.ceil(total.rows[0].total / paging.limit) });
  } catch (error) { return next(error); }
}

async function sendMessage(request, response, next, senderType) {
  if (!validUuid(request.params.caseId)) return failure(response, 'Invalid case ID', 400);
  const message = request.body && request.body.message;
  if (typeof message !== 'string' || !message.trim() || message.length > 5000) return failure(response, 'message must be a non-empty string of at most 5000 characters', 400);
  if (request.body.patient_id || request.body.sender_id || request.body.role || request.body.sender_type) return failure(response, 'Sender identity is determined by authentication', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.caseId, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    const result = await pool.query(
      `INSERT INTO case_conversations (case_id, sender_type, sender_user_id, message)
       VALUES ($1, $2, $3, $4) RETURNING id, sender_type, sender_user_id, message, created_at`,
      [caseRecord.id, senderType, request.user.id, message.trim()]
    );
    const people = await participants(caseRecord.id);
    const recipient = senderType === 'patient' ? people && people.doctor_user_id : people && people.patient_user_id;
    if (recipient) await safeCreateNotification({
      recipientUserId: recipient,
      type: senderType === 'patient' ? 'patient_message' : 'doctor_message',
      title: senderType === 'patient' ? 'New patient message' : 'New doctor message',
      message: senderType === 'patient' ? 'A patient sent a message about an authorized case.' : 'Your doctor sent a message about an authorized case.',
      caseId: caseRecord.id,
      dedupeKey: `message:${result.rows[0].id}`
    });
    return success(response, result.rows[0], 201);
  } catch (error) { return next(error); }
}

router.get('/cases/:caseId/messages', authenticate, listMessages);
router.post('/cases/:caseId/messages', messageRateLimit, ...patientOnly, (request, response, next) => sendMessage(request, response, next, 'patient'));
router.post('/doctors/me/cases/:caseId/messages', messageRateLimit, ...doctorOnly, (request, response, next) => sendMessage(request, response, next, 'doctor'));

module.exports = router;