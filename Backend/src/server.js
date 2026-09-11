const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`Swasthya backend listening on port ${env.port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down server.`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));