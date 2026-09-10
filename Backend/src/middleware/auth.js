const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const env = require('../config/env');

async function authenticate(request, response, next) {
  const authorization = request.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  if (!env.jwtSecret) {
    return response.status(500).json({ error: 'Authentication is not configured' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const result = await pool.query(
      `SELECT id, email, role, first_name, last_name, phone, is_active
       FROM users
       WHERE id = $1`,
      [payload.sub]
    );
    const user = result.rows[0];

    if (!user || !user.is_active) {
      return response.status(401).json({ error: 'Invalid or inactive account' });
    }

    request.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ error: 'Token has expired' });
    }

    return response.status(401).json({ error: 'Invalid token' });
  }
}

function authorizeRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: 'Insufficient permissions' });
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles
};