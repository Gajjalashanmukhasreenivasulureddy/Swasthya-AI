const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const allowedOrigins = new Set([env.clientUrl, 'http://localhost:5173', 'http://localhost:5174']);
const localDevelopmentOrigin = /^http:\/\/localhost:\d+$/;

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin) || localDevelopmentOrigin.test(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
});

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});

module.exports = {
  corsMiddleware,
  helmetMiddleware: helmet(),
  rateLimitMiddleware
};