const express = require('express');
const pool = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { success, failure } = require('../utils/response');

const router = express.Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validUuid(value) {
  return typeof value === 'string' && uuidPattern.test(value);
}

function pagination(request) {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 20);
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) return null;
  return { page, limit, offset: (page - 1) * limit };
}

router.get('/notifications', authenticate, async (request, response, next) => {
  const paging = pagination(request);
  if (!paging) return failure(response, 'page must be positive and limit must be between 1 and 100', 400);
  if (request.query.unreadOnly !== undefined && !['true', 'false'].includes(request.query.unreadOnly)) return failure(response, 'unreadOnly must be true or false', 400);
  const values = [request.user.id];
  const filters = ['recipient_user_id = $1'];
  if (request.query.unreadOnly === 'true') filters.push('is_read = FALSE');
  try {
    const total = await pool.query(`SELECT COUNT(*)::int AS total FROM notifications WHERE ${filters.join(' AND ')}`, values);
    const result = await pool.query(
      `SELECT id, type, title, message, case_id, appointment_id, is_read, created_at
       FROM notifications WHERE ${filters.join(' AND ')}
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [...values, paging.limit, paging.offset]
    );
    return success(response, {
      notifications: result.rows,
      page: paging.page,
      limit: paging.limit,
      total: total.rows[0].total,
      totalPages: Math.ceil(total.rows[0].total / paging.limit)
    });
  } catch (error) { return next(error); }
});

router.get('/notifications/unread-count', authenticate, async (request, response, next) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM notifications WHERE recipient_user_id = $1 AND is_read = FALSE', [request.user.id]);
    return success(response, { count: result.rows[0].count });
  } catch (error) { return next(error); }
});

router.patch('/notifications/:notificationId/read', authenticate, async (request, response, next) => {
  if (!validUuid(request.params.notificationId)) return failure(response, 'Invalid notification ID', 400);
  try {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND recipient_user_id = $2
       RETURNING id, is_read, created_at`,
      [request.params.notificationId, request.user.id]
    );
    if (!result.rows[0]) return failure(response, 'Notification not found or access denied', 404);
    return success(response, result.rows[0]);
  } catch (error) { return next(error); }
});

router.patch('/notifications/read-all', authenticate, async (request, response, next) => {
  try {
    const result = await pool.query('UPDATE notifications SET is_read = TRUE WHERE recipient_user_id = $1 AND is_read = FALSE', [request.user.id]);
    return success(response, { updated: result.rowCount });
  } catch (error) { return next(error); }
});

module.exports = router;