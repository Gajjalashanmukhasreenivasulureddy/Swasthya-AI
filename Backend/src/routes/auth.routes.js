const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const env = require('../config/env');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const validRoles = new Set(['patient', 'doctor', 'admin']);

function safeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    profile_id: user.profile_id || null,
    license_number: user.license_number || null,
    specialization: user.specialization || null
  };
}

async function findUserById(client, userId) {
  const result = await client.query(
    `SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.phone,
            p.id AS profile_id, d.id AS doctor_profile_id,
            d.license_number, d.specialization
     FROM users u
     LEFT JOIN patients p ON p.user_id = u.id
     LEFT JOIN doctors d ON d.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );

  const user = result.rows[0];
  if (user && !user.profile_id && user.doctor_profile_id) {
    user.profile_id = user.doctor_profile_id;
  }
  return user;
}

function createToken(user) {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '1h' });
}

router.post('/register', async (request, response, next) => {
  const {
    email,
    password,
    role = 'patient',
    first_name: firstName,
    last_name: lastName,
    phone,
    date_of_birth: dateOfBirth,
    gender,
    blood_group: bloodGroup,
    license_number: licenseNumber,
    specialization,
    qualifications,
    admin_registration_key: adminRegistrationKey
  } = request.body;

  if (!email || !password || !firstName || !lastName || !validRoles.has(role)) {
    return response.status(400).json({
      error: 'email, password, first_name, last_name, and a valid role are required'
    });
  }

  if (password.length < 8) {
    return response.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (role === 'admin' && (!env.adminRegistrationKey || adminRegistrationKey !== env.adminRegistrationKey)) {
    return response.status(403).json({ error: 'Admin registration is not authorized' });
  }

  if (role === 'doctor' && (!licenseNumber || !specialization)) {
    return response.status(400).json({ error: 'Doctors require license_number and specialization' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [normalizedEmail, passwordHash, role, firstName.trim(), lastName.trim(), phone || null]
    );
    const userId = userResult.rows[0].id;

    if (role === 'patient') {
      await client.query(
        `INSERT INTO patients (user_id, date_of_birth, gender, blood_group)
         VALUES ($1, $2, $3, $4)`,
        [userId, dateOfBirth || null, gender || null, bloodGroup || null]
      );
    }

    if (role === 'doctor') {
      await client.query(
        `INSERT INTO doctors (user_id, license_number, specialization, qualifications)
         VALUES ($1, $2, $3, $4)`,
        [userId, licenseNumber.trim(), specialization.trim(), qualifications || null]
      );
    }

    await client.query('COMMIT');
    const user = await findUserById(client, userId);
    return response.status(201).json({ user: safeUser(user), token: createToken(user) });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return response.status(409).json({ error: 'Email or doctor license number already exists' });
    }
    return next(error);
  } finally {
    client.release();
  }
});

router.post('/login', async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ error: 'email and password are required' });
  }

  try {
    const identifier = email.trim();
    const result = await pool.query(
          `SELECT u.id, u.email, u.password_hash, u.role, u.first_name, u.last_name, u.phone,
                  u.is_active, p.id AS profile_id, d.id AS doctor_profile_id,
                  d.license_number, d.specialization
           FROM users u
           LEFT JOIN patients p ON p.user_id = u.id
           LEFT JOIN doctors d ON d.user_id = u.id
             WHERE u.email = $1
              OR u.phone = $2
              OR d.license_number = $2`,
            [identifier.toLowerCase(), identifier]
    );
    const user = result.rows[0];

    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.profile_id && user.doctor_profile_id) {
      user.profile_id = user.doctor_profile_id;
    }
    return response.json({ user: safeUser(user), token: createToken(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authenticate, async (request, response, next) => {
  try {
    const user = await findUserById(pool, request.user.id);
    return response.json({ user: safeUser(user) });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;