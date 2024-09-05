const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { generateReport } = require('../controllers/reportsController');

// Route for generating reports
router.post('/generate', authenticateToken, generateReport);

module.exports = router;
