const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { success, failure } = require('../utils/response');
const { safeCreateNotification } = require('../services/notification.service');

const router = express.Router();
const caseIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const statuses = new Set(['draft', 'in_progress', 'submitted', 'reviewed', 'under_review', 'completed', 'cancelled']);
const caseFields = new Set([
  'chief_complaint',
  'symptoms',
  'symptom_duration',
  'severity',
  'medical_history',
  'medication_history',
  'allergy_history',
  'family_history',
  'lifestyle_history'
  , 'preferred_language', 'language_selection_response'
]);
const protectedFields = new Set([
  'id',
  'patient_id',
  'doctor_id',
  'assigned_doctor_id',
  'status',
  'submitted_at',
  'reviewed_at',
  'completed_at',
  'ai_summary',
  'urgent_flag',
  'urgent_message',
  'doctor_notes'
]);

const caseSelect = `
  SELECT pc.id, pc.patient_id, pc.assigned_doctor_id AS doctor_id,
         pc.chief_complaint, pc.status, pc.structured_history,
         pc.ai_summary, pc.doctor_notes, pc.urgent_flag, pc.urgent_message,
         pc.submitted_at, pc.reviewed_at, pc.completed_at,
         pc.created_at, pc.updated_at,
         pu.first_name AS patient_first_name, pu.last_name AS patient_last_name,
         du.first_name AS doctor_first_name, du.last_name AS doctor_last_name,
         d.specialization AS doctor_specialization
  FROM patient_cases pc
  JOIN patients p ON p.id = pc.patient_id
  JOIN users pu ON pu.id = p.user_id
  LEFT JOIN doctors d ON d.id = pc.assigned_doctor_id
  LEFT JOIN users du ON du.id = d.user_id`;

function validCaseId(id) {
  return typeof id === 'string' && caseIdPattern.test(id);
}

function isNonEmptyString(value, maximumLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximumLength;
}

function validSeverity(value) {
  return (Number.isInteger(value) && value >= 1 && value <= 10)
    || (typeof value === 'string' && ['mild', 'moderate', 'severe'].includes(value.toLowerCase()));
}

function validContent(value) {
  if (typeof value === 'string') return value.trim().length > 0 && value.length <= 10000;
  if (Array.isArray(value)) return value.length > 0 && value.length <= 100;
  return value !== null && typeof value === 'object';
}

function validateCaseBody(body, requireComplaint = false, allowDoctorNotes = false) {
  const fields = Object.keys(body || {});
  const forbidden = fields.find((field) => protectedFields.has(field) && !(allowDoctorNotes && field === 'doctor_notes'));
  const unknown = fields.find((field) => !caseFields.has(field) && !(allowDoctorNotes && field === 'doctor_notes'));
  if (forbidden) return `${forbidden} cannot be changed through this endpoint`;
  if (unknown) return `${unknown} is not a supported case field`;
  if (requireComplaint && !isNonEmptyString(body.chief_complaint, 2000)) {
    return 'chief_complaint is required and must be at most 2000 characters';
  }
  if (body.chief_complaint !== undefined && !isNonEmptyString(body.chief_complaint, 2000)) {
    return 'chief_complaint must be a non-empty string of at most 2000 characters';
  }
  if (body.symptoms !== undefined && !validContent(body.symptoms)) return 'symptoms must not be empty';
  if (body.severity !== undefined && !validSeverity(body.severity)) return 'severity must be 1-10, mild, moderate, or severe';
  if (body.symptom_duration !== undefined && !isNonEmptyString(body.symptom_duration, 200)) {
    return 'symptom_duration must be a non-empty string of at most 200 characters';
  }
  return null;
}

function buildStructuredHistory(body, existing = {}) {
  const history = { ...(existing || {}) };
  for (const field of [
    'symptoms',
    'symptom_duration',
    'severity',
    'medical_history',
    'medication_history',
    'allergy_history',
    'family_history',
    'lifestyle_history'
    , 'preferred_language', 'language_selection_response'
  ]) {
    if (body[field] !== undefined) history[field] = body[field];
  }
  return history;
}

async function getAuthorizedCase(caseId, user) {
  if (!validCaseId(caseId)) return null;
  const conditions = ['pc.id = $1'];
  const values = [caseId];

  if (user.role === 'patient') {
    values.push(user.id);
    conditions.push(`p.user_id = $${values.length}`);
  } else if (user.role === 'doctor') {
    values.push(user.id);
    conditions.push(`d.user_id = $${values.length}`);
  } else if (user.role !== 'admin') {
    return null;
  }

  const result = await pool.query(`${caseSelect} WHERE ${conditions.join(' AND ')}`, values);
  return result.rows[0] || null;
}

async function getConversation(caseId) {
  const result = await pool.query(
    `SELECT cc.id, cc.sender_type, cc.sender_user_id, cc.message, cc.created_at,
            u.first_name AS sender_first_name, u.last_name AS sender_last_name
     FROM case_conversations cc
     LEFT JOIN users u ON u.id = cc.sender_user_id
     WHERE cc.case_id = $1
     ORDER BY cc.created_at ASC`,
    [caseId]
  );
  return result.rows;
}

router.post('/', authenticate, authorizeRoles('patient'), async (request, response, next) => {
  const body = request.body || {};
  const validationError = validateCaseBody(body, true);
  if (validationError) return failure(response, validationError, 400);

  try {
    const patientResult = await pool.query('SELECT id FROM patients WHERE user_id = $1', [request.user.id]);
    if (!patientResult.rows[0]) return failure(response, 'Patient profile not found', 404);
    const history = buildStructuredHistory(body);
    const result = await pool.query(
      `INSERT INTO patient_cases (patient_id, chief_complaint, structured_history, status)
       VALUES ($1, $2, $3, 'draft')
       RETURNING id, patient_id, chief_complaint, status, structured_history, created_at, updated_at`,
      [patientResult.rows[0].id, body.chief_complaint.trim(), history]
    );
    return success(response, result.rows[0], 201);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', authenticate, async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    return success(response, { ...caseRecord, conversation: await getConversation(caseRecord.id) });
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticate, async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  const validationError = validateCaseBody(request.body || {});
  if (validationError) return failure(response, validationError, 400);

  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    if (request.user.role === 'patient' && caseRecord.status !== 'draft') {
      return failure(response, 'Only draft cases can be edited by the patient', 409);
    }
    if (request.user.role === 'doctor' && !['submitted', 'reviewed', 'under_review'].includes(caseRecord.status)) {
      return failure(response, 'This case cannot be edited in its current status', 409);
    }
    if (request.user.role === 'admin') return failure(response, 'Admins cannot edit clinical case content', 403);

    const body = request.body || {};
    const updates = [];
    const values = [];
    if (body.chief_complaint !== undefined) {
      values.push(body.chief_complaint.trim());
      updates.push(`chief_complaint = $${values.length}`);
    }
    if (Object.keys(body).some((field) => field !== 'chief_complaint')) {
      values.push(buildStructuredHistory(body, caseRecord.structured_history));
      updates.push(`structured_history = $${values.length}`);
    }
    if (updates.length === 0) return failure(response, 'At least one case field is required', 400);
    values.push(request.params.id);
    const result = await pool.query(
      `UPDATE patient_cases SET ${updates.join(', ')} WHERE id = $${values.length}
       RETURNING id, patient_id, chief_complaint, status, structured_history, doctor_notes,
                 submitted_at, reviewed_at, completed_at, created_at, updated_at`,
      values
    );
    const patient = await pool.query(
      `SELECT u.id FROM patients p JOIN users u ON u.id = p.user_id WHERE p.id = $1`,
      [caseRecord.patient_id]
    );
    if (patient.rows[0]) await safeCreateNotification({
      recipientUserId: patient.rows[0].id,
      type: 'case_reviewed',
      title: 'Case reviewed',
      message: 'Your doctor reviewed your case.',
      caseId: caseRecord.id,
      dedupeKey: `case_reviewed:${caseRecord.id}`
    });
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/submit', authenticate, authorizeRoles('patient'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    if (caseRecord.status !== 'draft') return failure(response, 'Only draft cases can be submitted', 409);
    const history = caseRecord.structured_history || {};
    if (!validContent(history.symptoms) || !validSeverity(history.severity)) {
      return failure(response, 'Symptoms and valid severity are required before submission', 400);
    }
    const result = await pool.query(
      `UPDATE patient_cases SET status = 'submitted', submitted_at = NOW()
       WHERE id = $1 AND status = 'draft'
       RETURNING id, patient_id, chief_complaint, status, structured_history, submitted_at, updated_at`,
      [request.params.id]
    );
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/review', authenticate, authorizeRoles('doctor'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  const body = request.body || {};
  const validationError = validateCaseBody(body, false, true);
  if (validationError) return failure(response, validationError, 400);
  if (body.doctor_notes !== undefined && (!isNonEmptyString(body.doctor_notes, 10000))) {
    return failure(response, 'doctor_notes must be a non-empty string of at most 10000 characters', 400);
  }

  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    if (caseRecord.status !== 'submitted') return failure(response, 'Only submitted cases can be reviewed', 409);
    const history = buildStructuredHistory(body, caseRecord.structured_history);
    const updates = ['status = \'reviewed\'', 'reviewed_at = NOW()', 'structured_history = $1'];
    const values = [history];
    if (body.chief_complaint !== undefined) {
      values.push(body.chief_complaint.trim());
      updates.push(`chief_complaint = $${values.length}`);
    }
    if (body.doctor_notes !== undefined) {
      values.push(body.doctor_notes.trim());
      updates.push(`doctor_notes = $${values.length}`);
    }
    values.push(request.params.id);
    const result = await pool.query(
      `UPDATE patient_cases SET ${updates.join(', ')} WHERE id = $${values.length}
       RETURNING id, patient_id, assigned_doctor_id AS doctor_id, chief_complaint,
                 status, structured_history, doctor_notes, reviewed_at, updated_at`,
      values
    );
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/complete', authenticate, authorizeRoles('doctor'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    if (caseRecord.status !== 'reviewed') return failure(response, 'Only reviewed cases can be completed', 409);
    const result = await pool.query(
      `UPDATE patient_cases SET status = 'completed', completed_at = NOW()
       WHERE id = $1 AND status = 'reviewed'
       RETURNING id, patient_id, assigned_doctor_id AS doctor_id, status, completed_at, updated_at`,
      [request.params.id]
    );
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/conversation', authenticate, async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    return success(response, await getConversation(caseRecord.id));
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/conversation', authenticate, authorizeRoles('patient', 'doctor'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  const message = request.body && request.body.message;
  if (!isNonEmptyString(message, 5000)) return failure(response, 'message must be a non-empty string of at most 5000 characters', 400);
  if (request.body.sender_type !== undefined || request.body.sender_user_id !== undefined) {
    return failure(response, 'Sender identity is determined by authentication', 400);
  }

  try {
    const caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    const result = await pool.query(
      `INSERT INTO case_conversations (case_id, sender_type, sender_user_id, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, case_id, sender_type, sender_user_id, message, created_at`,
      [caseRecord.id, request.user.role, request.user.id, message.trim()]
    );
    return success(response, result.rows[0], 201);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
module.exports.getAuthorizedCase = getAuthorizedCase;