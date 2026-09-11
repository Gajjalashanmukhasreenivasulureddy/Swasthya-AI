const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getAuthorizedCase } = require('./case.routes');
const { safeCreateNotification } = require('../services/notification.service');
const { success, failure } = require('../utils/response');

const router = express.Router();
const doctorOnly = [authenticate, authorizeRoles('doctor')];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const statuses = new Set(['draft', 'in_progress', 'submitted', 'reviewed', 'under_review', 'completed', 'cancelled']);
const sortColumns = {
  recent: 'pc.created_at DESC',
  oldest: 'pc.created_at ASC',
  updated: 'pc.updated_at DESC',
  urgent: 'pc.urgent_flag DESC, pc.created_at DESC'
};

function validUuid(value) {
  return typeof value === 'string' && uuidPattern.test(value);
}

async function doctorIdForUser(userId) {
  const result = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
  return result.rows[0] && result.rows[0].id;
}

function queueFilters(request, startIndex = 2) {
  const values = [request.user.id];
  const filters = ['d.user_id = $1'];
  let index = startIndex;
  const forcedFilters = request.dashboardFilters || {};
  const status = forcedFilters.status || request.query.status;
  const urgency = forcedFilters.urgency || request.query.urgency;
  if (status !== undefined) {
    if (!statuses.has(status)) return { error: 'Invalid case status filter' };
    values.push(status);
    filters.push(`pc.status = $${index++}`);
  }
  if (urgency !== undefined) {
    if (!['urgent', 'normal'].includes(urgency)) return { error: 'Invalid urgency filter' };
    values.push(urgency === 'urgent');
    filters.push(`pc.urgent_flag = $${index++}`);
  }
  if (request.query.patient !== undefined) {
    if (!validUuid(request.query.patient)) return { error: 'Invalid patient filter' };
    values.push(request.query.patient);
    filters.push(`pc.patient_id = $${index++}`);
  }
  if (request.query.search !== undefined) {
    if (typeof request.query.search !== 'string' || request.query.search.length > 100) return { error: 'Invalid search filter' };
    values.push(`%${request.query.search}%`);
    filters.push(`(pc.chief_complaint ILIKE $${index} OR pu.first_name ILIKE $${index} OR pu.last_name ILIKE $${index})`);
    index += 1;
  }
  if (request.query.from !== undefined) {
    if (Number.isNaN(Date.parse(request.query.from))) return { error: 'Invalid from date filter' };
    values.push(request.query.from);
    filters.push(`pc.created_at >= $${index++}`);
  }
  if (request.query.to !== undefined) {
    if (Number.isNaN(Date.parse(request.query.to))) return { error: 'Invalid to date filter' };
    values.push(request.query.to);
    filters.push(`pc.created_at <= $${index++}`);
  }
  return { filters, values, nextIndex: index };
}

const queueSelect = `
  FROM patient_cases pc
  JOIN patients p ON p.id = pc.patient_id
  JOIN users pu ON pu.id = p.user_id
  JOIN doctors d ON d.id = pc.assigned_doctor_id`;

router.get('/me/dashboard', doctorOnly, async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int AS total_assigned_cases,
         COUNT(*) FILTER (WHERE pc.status = 'submitted')::int AS new_submitted_cases,
         COUNT(*) FILTER (WHERE pc.status IN ('submitted', 'under_review'))::int AS awaiting_review_cases,
         COUNT(*) FILTER (WHERE pc.status = 'reviewed')::int AS reviewed_cases,
         COUNT(*) FILTER (WHERE pc.status = 'completed')::int AS completed_cases,
         COUNT(*) FILTER (WHERE pc.urgent_flag = TRUE)::int AS urgent_cases,
         (SELECT COUNT(*)::int FROM appointments a JOIN doctors ad ON ad.id = a.doctor_id
          WHERE ad.user_id = $1 AND a.scheduled_start >= CURRENT_DATE
            AND a.scheduled_start < CURRENT_DATE + INTERVAL '1 day'
            AND a.status NOT IN ('cancelled', 'no_show')) AS todays_appointments_count
       ${queueSelect}
       WHERE d.user_id = $1`,
      [request.user.id]
    );
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.get('/me/cases/new', doctorOnly, async (request, response, next) => {
  request.dashboardFilters = { status: 'submitted' };
  return queueHandler(request, response, next);
});

router.get('/me/cases/urgent', doctorOnly, async (request, response, next) => {
  request.dashboardFilters = { urgency: 'urgent' };
  return queueHandler(request, response, next);
});

async function queueHandler(request, response, next) {
  const parsed = queueFilters(request);
  if (parsed.error) return failure(response, parsed.error, 400);
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 20);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return failure(response, 'page must be positive and limit must be between 1 and 100', 400);
  }
  const sort = sortColumns[request.query.sort || 'recent'];
  if (!sort) return failure(response, 'Invalid sort option', 400);
  const offset = (page - 1) * limit;
  const countResult = await pool.query(`SELECT COUNT(*)::int AS total ${queueSelect} WHERE ${parsed.filters.join(' AND ')}`, parsed.values);
  const listValues = [...parsed.values, limit, offset];
  const result = await pool.query(
    `SELECT pc.id, pc.patient_id, pc.chief_complaint, pc.status, pc.structured_history,
            pc.ai_summary, pc.urgent_flag, pc.urgent_message, pc.doctor_notes,
            pc.submitted_at, pc.reviewed_at, pc.completed_at, pc.created_at, pc.updated_at,
            pu.first_name AS patient_first_name, pu.last_name AS patient_last_name
     ${queueSelect}
     WHERE ${parsed.filters.join(' AND ')}
     ORDER BY ${sort}
     LIMIT $${parsed.nextIndex} OFFSET $${parsed.nextIndex + 1}`,
    listValues
  );
  return success(response, {
    cases: result.rows,
    pagination: { page, limit, total: countResult.rows[0].total, totalPages: Math.ceil(countResult.rows[0].total / limit) }
  });
}

router.get('/me/cases', doctorOnly, queueHandler);

router.get('/me/patients', doctorOnly, async (request, response, next) => {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 20);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
    return failure(response, 'page must be positive and limit must be between 1 and 100', 400);
  }
  const values = [request.user.id];
  const filters = ['d.user_id = $1'];
  if (request.query.search !== undefined) {
    if (typeof request.query.search !== 'string' || request.query.search.length > 100) return failure(response, 'Invalid search filter', 400);
    values.push(`%${request.query.search}%`);
    filters.push(`(u.first_name ILIKE $${values.length} OR u.last_name ILIKE $${values.length} OR u.phone ILIKE $${values.length})`);
  }
  const sort = request.query.sort === 'oldest' ? 'MIN(pc.created_at) ASC' : 'MAX(pc.updated_at) DESC';
  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT p.id)::int AS total FROM patients p
     JOIN users u ON u.id = p.user_id
     JOIN patient_cases pc ON pc.patient_id = p.id
     JOIN doctors d ON d.id = pc.assigned_doctor_id
     WHERE ${filters.join(' AND ')}`,
    values
  );
  const result = await pool.query(
    `SELECT p.id AS patient_id, u.first_name, u.last_name, u.phone,
            p.date_of_birth, p.gender, p.blood_group,
            COUNT(DISTINCT pc.id)::int AS case_count, MAX(pc.updated_at) AS last_case_updated
     FROM patients p
     JOIN users u ON u.id = p.user_id
     JOIN patient_cases pc ON pc.patient_id = p.id
     JOIN doctors d ON d.id = pc.assigned_doctor_id
     WHERE ${filters.join(' AND ')}
     GROUP BY p.id, u.id
     ORDER BY ${sort}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, (page - 1) * limit]
  );
  return success(response, {
    patients: result.rows,
    pagination: { page, limit, total: countResult.rows[0].total, totalPages: Math.ceil(countResult.rows[0].total / limit) }
  });
});

router.get('/me/patients/:patientId', doctorOnly, async (request, response, next) => {
  if (!validUuid(request.params.patientId)) return failure(response, 'Invalid patient ID', 400);
  try {
    const authorized = await pool.query(
      `SELECT 1 FROM patient_cases pc JOIN doctors d ON d.id = pc.assigned_doctor_id
       WHERE pc.patient_id = $1 AND d.user_id = $2 LIMIT 1`,
      [request.params.patientId, request.user.id]
    );
    if (!authorized.rows[0]) return failure(response, 'Patient not found or access denied', 404);
    const [profile, cases, records, appointments] = await Promise.all([
      pool.query(
        `SELECT p.id AS patient_id, u.first_name, u.last_name, u.phone, p.date_of_birth,
                p.gender, p.blood_group, p.emergency_contact_name, p.emergency_contact_phone,
                p.address, p.created_at, p.updated_at
         FROM patients p JOIN users u ON u.id = p.user_id WHERE p.id = $1`, [request.params.patientId]
      ),
      pool.query(
        `SELECT pc.id, pc.chief_complaint, pc.status, pc.ai_summary, pc.urgent_flag,
                pc.submitted_at, pc.reviewed_at, pc.completed_at, pc.created_at, pc.updated_at
         FROM patient_cases pc JOIN doctors d ON d.id = pc.assigned_doctor_id
         WHERE pc.patient_id = $1 AND d.user_id = $2 ORDER BY pc.created_at DESC`,
        [request.params.patientId, request.user.id]
      ),
      pool.query(
        `SELECT mr.id, mr.record_type, mr.title, mr.record_data, mr.recorded_at, mr.case_id
         FROM medical_records mr JOIN patient_cases pc ON pc.patient_id = mr.patient_id
         JOIN doctors d ON d.id = pc.assigned_doctor_id AND (mr.doctor_id IS NULL OR mr.doctor_id = d.id)
         WHERE mr.patient_id = $1 AND d.user_id = $2 ORDER BY mr.recorded_at DESC`,
        [request.params.patientId, request.user.id]
      ),
      pool.query(
        `SELECT a.id, a.scheduled_start, a.scheduled_end, a.status, a.reason, a.notes
         FROM appointments a JOIN doctors d ON d.id = a.doctor_id
         WHERE a.patient_id = $1 AND d.user_id = $2 ORDER BY a.scheduled_start DESC`,
        [request.params.patientId, request.user.id]
      )
    ]);
    return success(response, { profile: profile.rows[0], cases: cases.rows, records: records.rows, appointments: appointments.rows });
  } catch (error) {
    return next(error);
  }
});

async function authorizedCase(request, response) {
  if (!validUuid(request.params.caseId)) {
    failure(response, 'Invalid case ID', 400);
    return null;
  }
  const caseRecord = await getAuthorizedCase(request.params.caseId, request.user);
  if (!caseRecord) {
    failure(response, 'Case not found or access denied', 404);
    return null;
  }
  return caseRecord;
}

router.get('/me/cases/:caseId', doctorOnly, async (request, response, next) => {
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    const conversation = await pool.query(
      `SELECT id, sender_type, message, created_at FROM case_conversations WHERE case_id = $1 ORDER BY created_at ASC`,
      [caseRecord.id]
    );
    const notes = await pool.query(
      `SELECT n.id, n.note_content, n.doctor_id, n.created_at, n.updated_at
       FROM doctor_case_notes n WHERE n.case_id = $1 ORDER BY n.created_at ASC`,
      [caseRecord.id]
    );
    return success(response, { ...caseRecord, conversation: conversation.rows, doctor_case_notes: notes.rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/me/cases/:caseId/summary', doctorOnly, async (request, response, next) => {
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    if (!caseRecord.ai_summary) return failure(response, 'AI summary is not available', 404);
    return success(response, caseRecord.ai_summary);
  } catch (error) {
    return next(error);
  }
});

router.get('/me/cases/:caseId/conversation', doctorOnly, async (request, response, next) => {
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    const result = await pool.query(
      `SELECT id, sender_type, message, created_at FROM case_conversations WHERE case_id = $1 ORDER BY created_at ASC`,
      [caseRecord.id]
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

router.post('/me/cases/:caseId/notes', doctorOnly, async (request, response, next) => {
  const content = request.body && request.body.note_content;
  if (typeof content !== 'string' || !content.trim() || content.length > 10000) return failure(response, 'note_content must be a non-empty string of at most 10000 characters', 400);
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    const doctorId = await doctorIdForUser(request.user.id);
    const result = await pool.query(
      `INSERT INTO doctor_case_notes (case_id, doctor_id, note_content) VALUES ($1, $2, $3)
       RETURNING id, case_id, doctor_id, note_content, created_at, updated_at`,
      [caseRecord.id, doctorId, content.trim()]
    );
    return success(response, result.rows[0], 201);
  } catch (error) {
    return next(error);
  }
});

router.put('/me/cases/:caseId/notes/:noteId', doctorOnly, async (request, response, next) => {
  const content = request.body && request.body.note_content;
  if (!validUuid(request.params.noteId)) return failure(response, 'Invalid note ID', 400);
  if (typeof content !== 'string' || !content.trim() || content.length > 10000) return failure(response, 'note_content must be a non-empty string of at most 10000 characters', 400);
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    const doctorId = await doctorIdForUser(request.user.id);
    const result = await pool.query(
      `UPDATE doctor_case_notes SET note_content = $1
       WHERE id = $2 AND case_id = $3 AND doctor_id = $4
       RETURNING id, case_id, doctor_id, note_content, created_at, updated_at`,
      [content.trim(), request.params.noteId, caseRecord.id, doctorId]
    );
    if (!result.rows[0]) return failure(response, 'Note not found or access denied', 404);
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.post('/me/cases/:caseId/review', doctorOnly, async (request, response, next) => {
  const notes = request.body && request.body.doctor_notes;
  if (notes !== undefined && (typeof notes !== 'string' || notes.length > 10000)) return failure(response, 'doctor_notes must be at most 10000 characters', 400);
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    if (caseRecord.status !== 'submitted') return failure(response, 'Only submitted cases can be reviewed', 409);
    const result = await pool.query(
      `UPDATE patient_cases SET status = 'reviewed', reviewed_at = NOW(), doctor_notes = COALESCE($1, doctor_notes)
       WHERE id = $2 AND status = 'submitted'
       RETURNING id, status, doctor_notes, reviewed_at, updated_at`,
      [notes === undefined ? null : notes.trim(), caseRecord.id]
    );
    const patient = await pool.query(
      `SELECT u.id FROM patients p JOIN users u ON u.id = p.user_id
       WHERE p.id = $1`, [caseRecord.patient_id]
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

router.post('/me/cases/:caseId/complete', doctorOnly, async (request, response, next) => {
  try {
    const caseRecord = await authorizedCase(request, response);
    if (!caseRecord) return;
    if (caseRecord.status !== 'reviewed') return failure(response, 'Only reviewed cases can be completed', 409);
    const result = await pool.query(
      `UPDATE patient_cases SET status = 'completed', completed_at = NOW()
       WHERE id = $1 AND status = 'reviewed'
       RETURNING id, status, completed_at, updated_at`,
      [caseRecord.id]
    );
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.get('/me/notifications', doctorOnly, async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT pc.id AS case_id, 'new_submitted_case' AS type,
              'New submitted case requires review' AS message, pc.urgent_flag,
              pc.created_at
       ${queueSelect}
       WHERE d.user_id = $1 AND pc.status = 'submitted'
       UNION ALL
       SELECT pc.id, 'urgent_case', 'Urgent case requires attention', pc.urgent_flag, pc.updated_at
       ${queueSelect}
       WHERE d.user_id = $1 AND pc.urgent_flag = TRUE AND pc.status NOT IN ('completed', 'cancelled')
       ORDER BY created_at DESC`,
      [request.user.id]
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;