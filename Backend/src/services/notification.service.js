const pool = require('../config/database');

async function createNotification({ recipientUserId, type, title, message, caseId = null, appointmentId = null, dedupeKey }) {
  if (!recipientUserId || !type || !title || !message) return null;
  const result = await pool.query(
    `INSERT INTO notifications
       (recipient_user_id, type, title, message, case_id, appointment_id, dedupe_key)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (dedupe_key) DO NOTHING
     RETURNING id, recipient_user_id, type, title, message, case_id, appointment_id, is_read, created_at`,
    [recipientUserId, type, title, message, caseId, appointmentId, dedupeKey || null]
  );
  return result.rows[0] || null;
}

async function safeCreateNotification(data) {
  try {
    return await createNotification(data);
  } catch (error) {
    console.error('Notification creation failed:', error.code || error.name);
    return null;
  }
}

module.exports = { createNotification, safeCreateNotification };