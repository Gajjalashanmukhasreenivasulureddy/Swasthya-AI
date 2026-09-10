const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { safeCreateNotification } = require('../services/notification.service');
const { success, failure } = require('../utils/response');

const router = express.Router();
const doctorOnly = [authenticate, authorizeRoles('doctor')];
const patientOnly = [authenticate, authorizeRoles('patient')];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const appointmentStatuses = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']);
const activeStatuses = ['pending', 'confirmed'];
const transitions = {
  pending: new Set(['confirmed', 'cancelled']),
  confirmed: new Set(['cancelled', 'completed', 'no_show']),
  cancelled: new Set(),
  completed: new Set(),
  no_show: new Set()
};

function validUuid(value) {
  return typeof value === 'string' && uuidPattern.test(value);
}

function validDate(value) {
  if (!datePattern.test(value || '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validTime(value) {
  return timePattern.test(value || '');
}

function minutes(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function timeText(value) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function defaultSchedule() {
  return Object.fromEntries(days.slice(1).concat('sunday').map((day) => [day, {
    enabled: false, start: null, end: null, breakStart: null, breakEnd: null
  }]));
}

function validateSchedule(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'weeklySchedule must be an object' };
  const normalized = defaultSchedule();
  for (const day of Object.keys(normalized)) {
    const value = input[day] || normalized[day];
    if (typeof value !== 'object' || Array.isArray(value) || typeof value.enabled !== 'boolean') {
      return { error: `${day} must include enabled` };
    }
    if (!value.enabled) {
      normalized[day] = { enabled: false, start: null, end: null, breakStart: null, breakEnd: null };
      continue;
    }
    if (!validTime(value.start) || !validTime(value.end) || minutes(value.start) >= minutes(value.end)) {
      return { error: `${day} must have valid start and end times with start before end` };
    }
    const hasBreakStart = value.breakStart !== undefined && value.breakStart !== null;
    const hasBreakEnd = value.breakEnd !== undefined && value.breakEnd !== null;
    if (hasBreakStart !== hasBreakEnd || (hasBreakStart && (!validTime(value.breakStart) || !validTime(value.breakEnd)
      || minutes(value.breakStart) >= minutes(value.breakEnd)
      || minutes(value.breakStart) < minutes(value.start)
      || minutes(value.breakEnd) > minutes(value.end)))) {
      return { error: `${day} has an invalid break` };
    }
    normalized[day] = {
      enabled: true,
      start: value.start,
      end: value.end,
      breakStart: hasBreakStart ? value.breakStart : null,
      breakEnd: hasBreakEnd ? value.breakEnd : null
    };
  }
  return { value: normalized };
}

async function doctorForId(doctorId) {
  const result = await pool.query(
    `SELECT d.id, d.user_id, d.specialization, u.first_name, u.last_name
     FROM doctors d JOIN users u ON u.id = d.user_id
     WHERE d.id = $1 AND u.is_active = TRUE`, [doctorId]
  );
  return result.rows[0];
}

async function doctorForUser(userId) {
  const result = await pool.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
  return result.rows[0] && result.rows[0].id;
}

async function patientForUser(userId) {
  const result = await pool.query('SELECT id FROM patients WHERE user_id = $1', [userId]);
  return result.rows[0] && result.rows[0].id;
}

async function scheduleForDoctor(doctorId) {
  const result = await pool.query('SELECT weekly_schedule, slot_duration_minutes FROM doctor_schedules WHERE doctor_id = $1', [doctorId]);
  return result.rows[0] || { weekly_schedule: defaultSchedule(), slot_duration_minutes: 30 };
}

async function leaveForDoctor(doctorId, date) {
  const result = await pool.query('SELECT id, reason, leave_date, created_at FROM doctor_leave WHERE doctor_id = $1 AND leave_date = $2', [doctorId, date]);
  return result.rows[0];
}

function appointmentTimestamp(date, time) {
  return `${date} ${time}:00+00`;
}

async function validateBooking(doctorId, date, time, duration) {
  if (!validDate(date)) return 'Invalid appointment date';
  if (!validTime(time)) return 'Invalid appointment time';
  const selected = new Date(appointmentTimestamp(date, time));
  if (Number.isNaN(selected.getTime()) || selected <= new Date()) return 'Appointment cannot be in the past';
  const schedule = await scheduleForDoctor(doctorId);
  const day = days[new Date(`${date}T00:00:00Z`).getUTCDay()];
  const working = schedule.weekly_schedule[day];
  if (!working || !working.enabled) return 'Doctor is unavailable on this day';
  const selectedMinutes = minutes(time);
  if (selectedMinutes < minutes(working.start) || selectedMinutes + duration > minutes(working.end)) return 'Appointment is outside working hours';
  if (working.breakStart && selectedMinutes < minutes(working.breakEnd) && selectedMinutes + duration > minutes(working.breakStart)) return 'Appointment overlaps the doctor break';
  if (selectedMinutes % duration !== minutes(working.start) % duration) return 'Appointment does not align with the slot duration';
  if (await leaveForDoctor(doctorId, date)) return 'Doctor is on leave for this date';
  return null;
}

const appointmentSelect = `
  SELECT a.id, a.doctor_id, a.patient_id, a.case_id, a.scheduled_start, a.scheduled_end,
         a.status, a.reason, a.notes, a.created_at, a.updated_at,
         du.id AS doctor_user_id, pu.id AS patient_user_id,
         du.first_name AS doctor_first_name, du.last_name AS doctor_last_name,
         d.specialization, pu.first_name AS patient_first_name, pu.last_name AS patient_last_name
  FROM appointments a
  JOIN doctors d ON d.id = a.doctor_id
  JOIN users du ON du.id = d.user_id
  JOIN patients p ON p.id = a.patient_id
  JOIN users pu ON pu.id = p.user_id`;

router.get('/doctors/me/schedule', doctorOnly, async (request, response, next) => {
  try {
    const doctorId = await doctorForUser(request.user.id);
    const schedule = await scheduleForDoctor(doctorId);
    return success(response, { weeklySchedule: schedule.weekly_schedule, slotDurationMinutes: schedule.slot_duration_minutes });
  } catch (error) { return next(error); }
});

router.put('/doctors/me/schedule', doctorOnly, async (request, response, next) => {
  const validation = validateSchedule(request.body && request.body.weeklySchedule);
  if (validation.error) return failure(response, validation.error, 400);
  const duration = request.body.slotDurationMinutes === undefined ? 30 : Number(request.body.slotDurationMinutes);
  if (!Number.isInteger(duration) || duration < 5 || duration > 240) return failure(response, 'slotDurationMinutes must be an integer from 5 to 240', 400);
  try {
    const doctorId = await doctorForUser(request.user.id);
    const result = await pool.query(
      `INSERT INTO doctor_schedules (doctor_id, weekly_schedule, slot_duration_minutes)
       VALUES ($1, $2, $3)
       ON CONFLICT (doctor_id) DO UPDATE SET weekly_schedule = EXCLUDED.weekly_schedule,
         slot_duration_minutes = EXCLUDED.slot_duration_minutes
       RETURNING weekly_schedule, slot_duration_minutes, created_at, updated_at`,
      [doctorId, validation.value, duration]
    );
    return success(response, { weeklySchedule: result.rows[0].weekly_schedule, slotDurationMinutes: result.rows[0].slot_duration_minutes });
  } catch (error) { return next(error); }
});

router.get('/doctors/me/leave', doctorOnly, async (request, response, next) => {
  try {
    const doctorId = await doctorForUser(request.user.id);
    const result = await pool.query('SELECT id, leave_date, reason, created_at FROM doctor_leave WHERE doctor_id = $1 ORDER BY leave_date ASC', [doctorId]);
    return success(response, result.rows);
  } catch (error) { return next(error); }
});

router.post('/doctors/me/leave', doctorOnly, async (request, response, next) => {
  const { date, reason } = request.body || {};
  if (!validDate(date)) return failure(response, 'date must use YYYY-MM-DD format', 400);
  if (reason !== undefined && (typeof reason !== 'string' || reason.length > 500)) return failure(response, 'reason must be at most 500 characters', 400);
  try {
    const doctorId = await doctorForUser(request.user.id);
    const result = await pool.query(
      'INSERT INTO doctor_leave (doctor_id, leave_date, reason) VALUES ($1, $2, $3) RETURNING id, leave_date, reason, created_at',
      [doctorId, date, reason ? reason.trim() : null]
    );
    return success(response, result.rows[0], 201);
  } catch (error) {
    if (error.code === '23505') return failure(response, 'Leave already exists for this date', 409);
    return next(error);
  }
});

router.delete('/doctors/me/leave/:leaveId', doctorOnly, async (request, response, next) => {
  if (!validUuid(request.params.leaveId)) return failure(response, 'Invalid leave ID', 400);
  try {
    const doctorId = await doctorForUser(request.user.id);
    const result = await pool.query('DELETE FROM doctor_leave WHERE id = $1 AND doctor_id = $2 RETURNING id', [request.params.leaveId, doctorId]);
    if (!result.rows[0]) return failure(response, 'Leave not found or access denied', 404);
    return success(response, { deleted: true });
  } catch (error) { return next(error); }
});

router.post('/appointments', patientOnly, async (request, response, next) => {
  const { doctor_id: doctorId, date, time, case_id: caseId, reason } = request.body || {};
  if (!validUuid(doctorId)) return failure(response, 'Valid doctor_id is required', 400);
  if (caseId !== undefined && !validUuid(caseId)) return failure(response, 'Invalid case_id', 400);
  if (reason !== undefined && (typeof reason !== 'string' || reason.length > 1000)) return failure(response, 'reason must be at most 1000 characters', 400);
  try {
    const doctor = await doctorForId(doctorId);
    if (!doctor) return failure(response, 'Doctor not found or inactive', 404);
    const schedule = await scheduleForDoctor(doctorId);
    const bookingError = await validateBooking(doctorId, date, time, schedule.slot_duration_minutes);
    if (bookingError) return failure(response, bookingError, 409);
    const patientId = await patientForUser(request.user.id);
    if (!patientId) return failure(response, 'Patient profile not found', 404);
    if (caseId) {
      const caseResult = await pool.query(
        `SELECT pc.id, pc.assigned_doctor_id FROM patient_cases pc WHERE pc.id = $1 AND pc.patient_id = $2`, [caseId, patientId]
      );
      if (!caseResult.rows[0]) return failure(response, 'Case not found or access denied', 404);
      if (caseResult.rows[0].assigned_doctor_id && caseResult.rows[0].assigned_doctor_id !== doctorId) return failure(response, 'Doctor is not assigned to this case', 403);
    }
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, case_id, scheduled_start, scheduled_end, status, reason)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6)
       RETURNING id, doctor_id, patient_id, case_id, scheduled_start, scheduled_end, status, reason, created_at, updated_at`,
      [patientId, doctorId, caseId || null, appointmentTimestamp(date, time), new Date(new Date(appointmentTimestamp(date, time)).getTime() + schedule.slot_duration_minutes * 60000), reason ? reason.trim() : null]
    );
    await safeCreateNotification({
      recipientUserId: doctor.user_id,
      type: 'appointment_booked',
      title: 'New appointment request',
      message: 'A patient booked an appointment with you.',
      caseId: caseId || null,
      appointmentId: result.rows[0].id,
      dedupeKey: `appointment_booked:${result.rows[0].id}`
    });
    return success(response, result.rows[0], 201);
  } catch (error) {
    if (error.code === '23505') return failure(response, 'Appointment slot is already booked', 409);
    return next(error);
  }
});

router.get('/doctors/me/appointments', doctorOnly, async (request, response, next) => {
  try {
    const values = [request.user.id];
    const filters = ['d.user_id = $1'];
    if (request.query.date !== undefined) { if (!validDate(request.query.date)) return failure(response, 'Invalid date filter', 400); values.push(request.query.date); filters.push(`a.scheduled_start::date = $${values.length}`); }
    if (request.query.start_date !== undefined) { if (!validDate(request.query.start_date)) return failure(response, 'Invalid start_date filter', 400); values.push(request.query.start_date); filters.push(`a.scheduled_start::date >= $${values.length}`); }
    if (request.query.end_date !== undefined) { if (!validDate(request.query.end_date)) return failure(response, 'Invalid end_date filter', 400); values.push(request.query.end_date); filters.push(`a.scheduled_start::date <= $${values.length}`); }
    if (request.query.status !== undefined) { if (!appointmentStatuses.has(request.query.status)) return failure(response, 'Invalid appointment status', 400); values.push(request.query.status); filters.push(`a.status = $${values.length}`); }
    if (request.query.patient_search !== undefined) { values.push(`%${request.query.patient_search}%`); filters.push(`(pu.first_name ILIKE $${values.length} OR pu.last_name ILIKE $${values.length})`); }
    const page = Number(request.query.page || 1); const limit = Number(request.query.limit || 20);
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) return failure(response, 'Invalid pagination', 400);
    const total = await pool.query(`SELECT COUNT(*)::int AS total ${appointmentSelect.replace(/^\s*SELECT[\s\S]*?FROM/, 'FROM')} WHERE ${filters.join(' AND ')}`, values);
    const result = await pool.query(`${appointmentSelect} WHERE ${filters.join(' AND ')} ORDER BY a.scheduled_start ASC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`, [...values, limit, (page - 1) * limit]);
    return success(response, { appointments: result.rows, pagination: { page, limit, total: total.rows[0].total, totalPages: Math.ceil(total.rows[0].total / limit) } });
  } catch (error) { return next(error); }
});

router.get('/patients/me/appointments', patientOnly, async (request, response, next) => {
  try {
    const values = [request.user.id]; const filters = ['p.user_id = $1'];
    if (request.query.status !== undefined) { if (!appointmentStatuses.has(request.query.status)) return failure(response, 'Invalid appointment status', 400); values.push(request.query.status); filters.push(`a.status = $${values.length}`); }
    if (request.query.upcoming === 'true') filters.push('a.scheduled_start >= NOW()');
    if (request.query.past === 'true') filters.push('a.scheduled_start < NOW()');
    const result = await pool.query(`${appointmentSelect} WHERE ${filters.join(' AND ')} ORDER BY a.scheduled_start ASC`, values);
    return success(response, result.rows);
  } catch (error) { return next(error); }
});

router.get('/appointments/:appointmentId', authenticate, authorizeRoles('patient', 'doctor'), async (request, response, next) => {
  if (!validUuid(request.params.appointmentId)) return failure(response, 'Invalid appointment ID', 400);
  try {
    const values = [request.params.appointmentId, request.user.id];
    const result = await pool.query(`${appointmentSelect} WHERE a.id = $1 AND (p.user_id = $2 OR d.user_id = $2)`, values);
    if (!result.rows[0]) return failure(response, 'Appointment not found or access denied', 404);
    return success(response, result.rows[0]);
  } catch (error) { return next(error); }
});

async function authorizedAppointment(appointmentId, userId, role) {
  const ownerColumn = role === 'doctor' ? 'd.user_id' : 'p.user_id';
  const result = await pool.query(`${appointmentSelect} WHERE a.id = $1 AND ${ownerColumn} = $2`, [appointmentId, userId]);
  return result.rows[0];
}

router.patch('/doctors/me/appointments/:appointmentId/confirm', doctorOnly, async (request, response, next) => {
  return transitionAppointment(request, response, next, 'confirmed', 'doctor');
});

router.patch('/doctors/me/appointments/:appointmentId/complete', doctorOnly, async (request, response, next) => {
  return transitionAppointment(request, response, next, 'completed', 'doctor');
});

router.patch('/appointments/:appointmentId/cancel', authenticate, authorizeRoles('patient', 'doctor'), async (request, response, next) => {
  return transitionAppointment(request, response, next, 'cancelled', request.user.role);
});

async function transitionAppointment(request, response, next, nextStatus, role) {
  if (!validUuid(request.params.appointmentId)) return failure(response, 'Invalid appointment ID', 400);
  try {
    const appointment = await authorizedAppointment(request.params.appointmentId, request.user.id, role);
    if (!appointment) return failure(response, 'Appointment not found or access denied', 404);
    if (!transitions[appointment.status] || !transitions[appointment.status].has(nextStatus)) return failure(response, `Cannot change appointment from ${appointment.status} to ${nextStatus}`, 409);
    const result = await pool.query(`UPDATE appointments SET status = $1 WHERE id = $2 RETURNING id, status, updated_at`, [nextStatus, appointment.id]);
    const recipientUserId = nextStatus === 'confirmed' || nextStatus === 'completed'
      ? appointment.patient_user_id
      : (role === 'doctor' ? appointment.patient_user_id : appointment.doctor_user_id);
    const notificationType = nextStatus === 'confirmed'
      ? 'appointment_confirmed'
      : nextStatus === 'completed'
        ? 'appointment_completed'
        : 'appointment_cancelled';
    await safeCreateNotification({
      recipientUserId,
      type: notificationType,
      title: `Appointment ${nextStatus}`,
      message: `Your appointment was ${nextStatus}.`,
      caseId: appointment.case_id,
      appointmentId: appointment.id,
      dedupeKey: `${notificationType}:${appointment.id}`
    });
    return success(response, result.rows[0]);
  } catch (error) { return next(error); }
}

router.get('/doctors/:doctorId/availability', authenticate, async (request, response, next) => {
  if (!validUuid(request.params.doctorId)) return failure(response, 'Invalid doctor ID', 400);
  if (!validDate(request.query.date)) return failure(response, 'date must use YYYY-MM-DD format', 400);
  try {
    const doctor = await doctorForId(request.params.doctorId);
    if (!doctor) return failure(response, 'Doctor not found or inactive', 404);
    const schedule = await scheduleForDoctor(doctor.id);
    const date = request.query.date;
    const day = days[new Date(`${date}T00:00:00Z`).getUTCDay()];
    const working = schedule.weekly_schedule[day];
    if (!working || !working.enabled || await leaveForDoctor(doctor.id, date)) return success(response, { date, slotDuration: schedule.slot_duration_minutes, slots: [] });
    const booked = await pool.query(
      `SELECT to_char(scheduled_start AT TIME ZONE 'UTC', 'HH24:MI') AS time
       FROM appointments WHERE doctor_id = $1 AND scheduled_start::date = $2 AND status = ANY($3::text[])`,
      [doctor.id, date, activeStatuses]
    );
    const bookedTimes = new Set(booked.rows.map((row) => row.time));
    const slots = [];
    for (let value = minutes(working.start); value + schedule.slot_duration_minutes <= minutes(working.end); value += schedule.slot_duration_minutes) {
      const inBreak = working.breakStart && value < minutes(working.breakEnd) && value + schedule.slot_duration_minutes > minutes(working.breakStart);
      const timestamp = new Date(appointmentTimestamp(date, timeText(value)));
      slots.push({ time: timeText(value), available: !inBreak && !bookedTimes.has(timeText(value)) && timestamp > new Date() });
    }
    return success(response, { date, slotDuration: schedule.slot_duration_minutes, slots });
  } catch (error) { return next(error); }
});

module.exports = router;