const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const corsMiddleware = cors({
  origin: env.clientUrl,
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