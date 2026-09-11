const express = require('express');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/patient', authenticate, authorizeRoles('patient'), (request, response) => {
  response.json({ message: 'Patient access granted', user_id: request.user.id });
});

router.get('/doctor', authenticate, authorizeRoles('doctor'), (request, response) => {
  response.json({ message: 'Doctor access granted', user_id: request.user.id });
});

router.get('/admin', authenticate, authorizeRoles('admin'), (request, response) => {
  response.json({ message: 'Admin access granted', user_id: request.user.id });
});

module.exports = router;