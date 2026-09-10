const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getAuthorizedCase } = require('./case.routes');
const {
  GeminiServiceError,
  generateNextQuestion,
  generateCaseSummary
} = require('../services/ai.service');
const { success, failure } = require('../utils/response');
const { safeCreateNotification } = require('../services/notification.service');

const router = express.Router();
const caseIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const safetyMessage = 'Potentially urgent symptoms were identified. Please seek immediate professional or emergency medical attention.';

function validCaseId(id) {
  return typeof id === 'string' && caseIdPattern.test(id);
}

function validInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be an object';
  if (body.caseData !== undefined && (typeof body.caseData !== 'object' || Array.isArray(body.caseData))) return 'caseData must be an object';
  if (body.conversation !== undefined && !Array.isArray(body.conversation)) return 'conversation must be an array';
  if (Array.isArray(body.conversation) && body.conversation.length > 50) return 'conversation is too large';
  return null;
}

function aiFailure(error, response, next) {
  if (!(error instanceof GeminiServiceError)) return next(error);
  console.error('Gemini AI request failed:', error.code);
  const statusCode = error.code === 'AI_NOT_CONFIGURED' || error.code === 'AI_UNAVAILABLE' ? 503 : 502;
  return failure(response, error.code === 'AI_UNSAFE_RESPONSE'
    ? 'The AI returned unsafe content and the response was discarded'
    : 'The AI service could not return a valid case-taking response', statusCode);
}

async function getCaseConversation(caseId) {
  const result = await pool.query(
    `SELECT id, sender_type, message, created_at
     FROM (
       SELECT id, sender_type, message, created_at
       FROM case_conversations
       WHERE case_id = $1
       ORDER BY created_at DESC
       LIMIT 20
     ) recent
     ORDER BY created_at ASC`,
    [caseId]
  );
  return result.rows;
}

function aiCaseData(caseRecord) {
  return {
    chief_complaint: caseRecord.chief_complaint,
    status: caseRecord.status,
    structured_history: caseRecord.structured_history || {},
    doctor_notes: caseRecord.doctor_notes || null
  };
}

async function saveInformation(caseRecord, information, urgency) {
  const structuredHistory = {
    ...(caseRecord.structured_history || {}),
    ai_information: information
  };
  await pool.query(
    `UPDATE patient_cases
     SET structured_history = $1,
         urgent_flag = CASE WHEN $2 = 'urgent' THEN TRUE ELSE urgent_flag END,
         urgent_message = CASE WHEN $2 = 'urgent' THEN $3 ELSE urgent_message END
     WHERE id = $4`,
    [structuredHistory, urgency, safetyMessage, caseRecord.id]
  );
  if (urgency === 'urgent' && caseRecord.doctor_id) {
    const doctor = await pool.query('SELECT user_id FROM doctors WHERE id = $1', [caseRecord.doctor_id]);
    if (doctor.rows[0]) await safeCreateNotification({
      recipientUserId: doctor.rows[0].user_id,
      type: 'urgent_case',
      title: 'Urgent case requires attention',
      message: safetyMessage,
      caseId: caseRecord.id,
      dedupeKey: `urgent_case:${caseRecord.id}`
    });
  }
}

async function saveSummary(caseId, summary) {
  await pool.query(
    `UPDATE patient_cases
     SET ai_summary = $1,
         urgent_flag = CASE WHEN $2 = 'urgent' THEN TRUE ELSE urgent_flag END,
         urgent_message = CASE WHEN $2 = 'urgent' THEN $3 ELSE urgent_message END
     WHERE id = $4`,
    [summary, summary.urgency, safetyMessage, caseId]
  );
  if (summary.urgency === 'urgent') {
    const doctor = await pool.query(
      `SELECT d.user_id FROM patient_cases pc JOIN doctors d ON d.id = pc.assigned_doctor_id WHERE pc.id = $1`,
      [caseId]
    );
    if (doctor.rows[0]) await safeCreateNotification({
      recipientUserId: doctor.rows[0].user_id,
      type: 'urgent_case',
      title: 'Urgent case requires attention',
      message: safetyMessage,
      caseId,
      dedupeKey: `urgent_case:${caseId}`
    });
  }
}

router.post('/ai/next-question', authenticate, authorizeRoles('patient', 'doctor', 'admin'), async (request, response, next) => {
  const validationError = validInput(request.body);
  if (validationError) return failure(response, validationError, 400);
  try {
    const result = await generateNextQuestion(request.body.caseData || {}, request.body.conversation || []);
    return success(response, result);
  } catch (error) {
    return aiFailure(error, response, next);
  }
});

router.post('/ai/generate-summary', authenticate, authorizeRoles('patient', 'doctor', 'admin'), async (request, response, next) => {
  const validationError = validInput(request.body);
  if (validationError) return failure(response, validationError, 400);
  try {
    const result = await generateCaseSummary(request.body.caseData || {}, request.body.conversation || []);
    return success(response, result);
  } catch (error) {
    return aiFailure(error, response, next);
  }
});

router.post('/cases/:id/ai-question', authenticate, authorizeRoles('patient', 'doctor'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  const message = request.body && request.body.message;
  if (message !== undefined && (typeof message !== 'string' || !message.trim() || message.length > 5000)) {
    return failure(response, 'message must be a non-empty string of at most 5000 characters', 400);
  }
  if (request.body && (request.body.sender_type !== undefined || request.body.sender_user_id !== undefined)) {
    return failure(response, 'Sender identity is determined by authentication', 400);
  }

  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    if (message !== undefined) {
      await pool.query(
        `INSERT INTO case_conversations (case_id, sender_type, sender_user_id, message)
         VALUES ($1, $2, $3, $4)`,
        [caseRecord.id, request.user.role, request.user.id, message.trim()]
      );
    }
    const conversation = await getCaseConversation(caseRecord.id);
    const question = await generateNextQuestion(aiCaseData(caseRecord), conversation);
    await saveInformation(caseRecord, question.informationCollected, question.urgency);
    if (question.nextQuestion) {
      await pool.query(
        `INSERT INTO case_conversations (case_id, sender_type, message, ai_metadata)
         VALUES ($1, 'ai', $2, $3)`,
        [caseRecord.id, question.nextQuestion, { type: 'follow_up_question', urgency: question.urgency }]
      );
    }
    return success(response, question);
  } catch (error) {
    return aiFailure(error, response, next);
  }
});

router.post('/cases/:id/generate-summary', authenticate, authorizeRoles('patient', 'doctor', 'admin'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    const summary = await generateCaseSummary(aiCaseData(caseRecord), await getCaseConversation(caseRecord.id));
    await saveSummary(caseRecord.id, summary);
    return success(response, summary);
  } catch (error) {
    return aiFailure(error, response, next);
  }
});

module.exports = router;