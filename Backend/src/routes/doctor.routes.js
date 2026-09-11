const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { success, failure } = require('../utils/response');

const router = express.Router();
const doctorOnly = [authenticate, authorizeRoles('doctor')];
const allowedFields = new Set([
  'first_name',
  'last_name',
  'phone',
  'specialization',
  'qualifications',
  'bio',
  'availability'
]);
const blockedFields = new Set([
  'id',
  'user_id',
  'role',
  'password',
  'password_hash',
  'email',
  'is_active',
  'license_number'
]);
const caseStatuses = new Set(['draft', 'in_progress', 'submitted', 'reviewed', 'under_review', 'completed', 'cancelled']);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const profileQuery = `
  SELECT u.id AS user_id, u.email, u.first_name, u.last_name, u.phone,
         d.id AS doctor_id, d.license_number, d.specialization,
         d.qualifications, d.bio, d.availability, d.created_at, d.updated_at
  FROM users u
  JOIN doctors d ON d.user_id = u.id
  WHERE u.id = $1`;

async function getDoctorProfile(userId, client = pool) {
  const result = await client.query(profileQuery, [userId]);
  return result.rows[0];
}

router.get('/me', doctorOnly, async (request, response, next) => {
  try {
    const profile = await getDoctorProfile(request.user.id);
    if (!profile) return failure(response, 'Doctor profile not found', 404);
    return success(response, profile);
  } catch (error) {
    return next(error);
  }
});

router.put('/me', doctorOnly, async (request, response, next) => {
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
  if (body.availability !== undefined && (typeof body.availability !== 'object' || Array.isArray(body.availability))) {
    return failure(response, 'availability must be a JSON object', 400);
  }

  const userFields = ['first_name', 'last_name', 'phone'].filter((field) => body[field] !== undefined);
  const doctorFields = ['specialization', 'qualifications', 'bio', 'availability']
    .filter((field) => body[field] !== undefined);
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
    if (doctorFields.length > 0) {
      const values = doctorFields.map((field) => body[field]);
      const assignments = doctorFields.map((field, index) => `${field} = $${index + 1}`);
      await client.query(
        `UPDATE doctors SET ${assignments.join(', ')} WHERE user_id = $${values.length + 1}`,
        [...values, request.user.id]
      );
    }
    await client.query('COMMIT');
    return success(response, await getDoctorProfile(request.user.id, client));
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
});

router.get('/me/cases', doctorOnly, async (request, response, next) => {
  const values = [request.user.id];
  const conditions = ['d.user_id = $1'];
  if (request.query.status !== undefined) {
    if (!caseStatuses.has(request.query.status)) return failure(response, 'Invalid case status filter', 400);
    values.push(request.query.status);
    conditions.push(`pc.status = $${values.length}`);
  }
  if (request.query.patient !== undefined) {
    if (!uuidPattern.test(request.query.patient)) return failure(response, 'Invalid patient filter', 400);
    values.push(request.query.patient);
    conditions.push(`pc.patient_id = $${values.length}`);
  }
  if (request.query.from !== undefined) {
    if (Number.isNaN(Date.parse(request.query.from))) return failure(response, 'Invalid from date filter', 400);
    values.push(request.query.from);
    conditions.push(`pc.created_at >= $${values.length}`);
  }
  if (request.query.to !== undefined) {
    if (Number.isNaN(Date.parse(request.query.to))) return failure(response, 'Invalid to date filter', 400);
    values.push(request.query.to);
    conditions.push(`pc.created_at <= $${values.length}`);
  }
  try {
    const result = await pool.query(
      `SELECT pc.id, pc.patient_id, pc.chief_complaint, pc.status, pc.ai_summary,
              pc.structured_history, pc.urgent_flag, pc.urgent_message,
              pc.doctor_notes, pc.submitted_at, pc.reviewed_at, pc.completed_at,
              pc.created_at, pc.updated_at
       FROM patient_cases pc
       JOIN doctors d ON d.id = pc.assigned_doctor_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY pc.created_at DESC`,
      values
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/me/appointments', doctorOnly, async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.patient_id, a.scheduled_start, a.scheduled_end, a.status,
              a.reason, a.notes, a.created_at, a.updated_at
       FROM appointments a
       JOIN doctors d ON d.id = a.doctor_id
       WHERE d.user_id = $1
       ORDER BY a.scheduled_start DESC`,
      [request.user.id]
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id/patients', authenticate, authorizeRoles('doctor', 'admin'), async (request, response, next) => {
  try {
    const doctorResult = await pool.query('SELECT id FROM doctors WHERE id = $1', [request.params.id]);
    if (!doctorResult.rows[0]) return failure(response, 'Doctor not found', 404);

    if (request.user.role === 'doctor') {
      const ownDoctor = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [request.user.id]);
      if (!ownDoctor.rows[0] || ownDoctor.rows[0].id !== request.params.id) {
        return failure(response, 'You are not authorized to access this doctor\'s patients', 403);
      }
    }

    const result = await pool.query(
      `SELECT DISTINCT p.id AS patient_id, u.id AS user_id, u.first_name,
              u.last_name, u.phone, p.date_of_birth, p.gender, p.blood_group
       FROM patients p
       JOIN users u ON u.id = p.user_id
       WHERE EXISTS (
         SELECT 1 FROM patient_cases pc
         WHERE pc.patient_id = p.id AND pc.assigned_doctor_id = $1
       )
       OR EXISTS (
         SELECT 1 FROM appointments a
         WHERE a.patient_id = p.id AND a.doctor_id = $1
       )
       ORDER BY u.last_name, u.first_name`,
      [request.params.id]
    );
    return success(response, result.rows);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT d.id AS doctor_id, u.first_name, u.last_name,
              d.specialization, d.qualifications, d.bio
       FROM doctors d
       JOIN users u ON u.id = d.user_id
       WHERE d.id = $1 AND u.is_active = TRUE`,
      [request.params.id]
    );
    if (!result.rows[0]) return failure(response, 'Doctor not found', 404);
    return success(response, result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;