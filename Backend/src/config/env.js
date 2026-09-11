const dotenv = require('dotenv');

dotenv.config();

const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminRegistrationKey: process.env.ADMIN_REGISTRATION_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  multilingualApiUrl: process.env.MULTILINGUAL_API_URL,
  multilingualApiKey: process.env.MULTILINGUAL_API_KEY,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};

module.exports = env;