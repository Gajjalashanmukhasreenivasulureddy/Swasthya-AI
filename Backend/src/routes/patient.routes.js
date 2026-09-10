const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { success, failure } = require('../utils/response');

const router = express.Router();
const patientOnly = [authenticate, authorizeRoles('patient')];
const blockedFields = new Set([
  'id',
  'user_id',
  'role',
  'password',
  'password_hash',
  'email',
  'is_active'
]);
const allowedFields = new Set([
  'first_name',
  'last_name',
  'phone',
  'date_of_birth',
  'gender',
  'blood_group',
  'emergency_contact_name',
  'emergency_contact_phone',
  'address'
]);
const caseStatuses = new Set(['draft', 'in_progress', 'submitted', 'reviewed', 'under_review', 'completed', 'cancelled']);

const profileQuery = `
  SELECT u.id AS user_id, u.email, u.first_name, u.last_name, u.phone,
         p.id AS patient_id, p.date_of_birth, p.gender, p.blood_group,
         p.emergency_contact_name, p.emergency_contact_phone, p.address,
         p.created_at, p.updated_at
  FROM users u
  JOIN patients p ON p.user_id = u.id
  WHERE u.id = $1`;

router.get('/me', patientOnly, async (request, response, next) => {
  try {
    const result = await pool.query(profileQuery, [request.user.id]);
    if (!result.rows[0]) return failure(response, 'Patient profile not found', 404);
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put('/me', patientOnly, async (request, response, next) => {
  const body = request.body || {};
  const fields = Object.keys(body);
  const protectedField = fields.find((field) => blockedFields.has(field));
  const unknownField = fields.find((field) => !allowedFields.has(field));

  if (protectedField) return failure(response, `${protectedField} cannot be changed`, 400);
  if (unknownField) return failure(response, `${unknownField} is not a supported profile field`, 400);
  if (fields.length === 0) return failure(response, 'At least one profile field is required', 400);
  if (body.first_name !== undefined && (typeof body.first_name !== 'string' || !body.first_name.trim() || body.first_name.length > 100)) {
    return failure(response, 'first_name must be between 1 and 100 characters', 400);
  }
  if (body.last_name !== undefined && (typeof body.last_name !== 'string' || !body.last_name.trim() || body.last_name.length > 100)) {
    return failure(response, 'last_name must be between 1 and 100 characters', 400);
  }

  const userFields = ['first_name', 'last_name', 'phone'].filter((field) => body[field] !== undefined);
  const patientFields = [
    'date_of_birth',
    'gender',
    'blood_group',
    'emergency_contact_name',
    'emergency_contact_phone',
    'address'
  ].filter((field) => body[field] !== undefined);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    if (userFields.length > 0) {
      const values = userFields.map((field) => body[field]);
      const assignments = userFields.map((field, index) => `${field} = $${index + 1}`);
      await client.query(
        `UPDATE users SET ${assignments.join(', ')} WHERE id = $${values.length + 1}`,
        [...values, request.user.id]
      );
    }
    if (patientFields.length > 0) {
      const values = patientFields.map((field) => body[field]);
      const assignments = patientFields.map((field, index) => `${field} = $${index + 1}`);
      await client.query(
        `UPDATE patients SET ${assignments.join(', ')} WHERE user_id = $${values.length + 1}`,
        [...values, request.user.id]
      );
    }
    await client.query('COMMIT');
    const result = await client.query(profileQuery, [request.user.id]);
    return success(response, result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/me/cases', patientOnly, async (request, response, next) => {
  const values = [request.user.id];
  const conditions = ['p.user_id = $1'];
  if (request.query.status !== undefined) {
    if (!caseStatuses.has(request.query.status)) return failure(response, 'Invalid case status filter', 400);
    values.push(request.query.status);
    conditions.push(`pc.status = $${values.length}`);
  }
  let limitClause = '';
  if (request.query.recent !== undefined) {
    const recent = Number(request.query.recent);
    if (!Number.isInteger(recent) || recent < 1 || recent > 100) return failure(response, 'recent must be an integer from 1 to 100', 400);
    values.push(recent);
    limitClause = ` LIMIT $${values.length}`;
  }
  try {
    const result = await pool.query(
      `SELECT pc.id, pc.chief_complaint, pc.status, pc.ai_summary, pc.structured_history,
              pc.urgent_flag, pc.urgent_message, pc.submitted_at, pc.reviewed_at,
              pc.completed_at, pc.created_at, pc.updated_at,
              pc.doctor_notes, d.id AS doctor_id, du.first_name AS doctor_first_name,
              du.last_name AS doctor_last_name, d.specialization
       FROM patient_cases pc
       JOIN patients p ON p.id = pc.patient_id
       LEFT JOIN doctors d ON d.id = pc.assigned_doctor_id
       LEFT JOIN users du ON du.id = d.user_id
            WHERE ${conditions.join(' AND ')}
            ORDER BY pc.created_at DESC${limitClause}`,
                values
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/me/appointments', patientOnly, async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.scheduled_start, a.scheduled_end, a.status, a.reason, a.notes,
              a.created_at, a.updated_at, d.id AS doctor_id,
              u.first_name AS doctor_first_name, u.last_name AS doctor_last_name,
              d.specialization
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       JOIN users u ON u.id = d.user_id
       WHERE p.user_id = $1
       ORDER BY a.scheduled_start DESC`,
      [request.user.id]
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/me/records', patientOnly, async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT mr.id, mr.record_type, mr.title, mr.record_data, mr.recorded_at,
              mr.created_at, mr.updated_at, mr.case_id, mr.doctor_id,
              u.first_name AS doctor_first_name, u.last_name AS doctor_last_name
       FROM medical_records mr
       JOIN patients p ON p.id = mr.patient_id
       LEFT JOIN doctors d ON d.id = mr.doctor_id
       LEFT JOIN users u ON u.id = d.user_id
       WHERE p.user_id = $1
       ORDER BY mr.recorded_at DESC`,
      [request.user.id]
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;