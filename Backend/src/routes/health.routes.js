const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
  response.status(200).json({
    status: 'ok',
    service: 'swasthya-backend',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;