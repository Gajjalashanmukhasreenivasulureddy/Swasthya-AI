const express = require('express');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const doctorDashboardRoutes = require('./routes/doctor-dashboard.routes');
const caseRoutes = require('./routes/case.routes');
const aiRoutes = require('./routes/ai.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const notificationRoutes = require('./routes/notification.routes');
const messageRoutes = require('./routes/message.routes');
const {
  corsMiddleware,
  helmetMiddleware,
  rateLimitMiddleware
} = require('./middleware/security');

const app = express();

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (request, response) => {
  response.json({ message: 'Welcome to the Swasthya API' });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', notificationRoutes);
app.use('/api', messageRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorDashboardRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api', aiRoutes);

app.use((request, response) => {
  response.status(404).json({ success: false, error: { message: 'Route not found' } });
});

app.use((error, request, response, next) => {
  console.error('Unhandled server error:', error.message);
  response.status(500).json({ success: false, error: { message: 'Internal server error' } });
});

module.exports = app;