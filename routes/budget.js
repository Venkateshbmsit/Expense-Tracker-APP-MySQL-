const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { setBudget, trackBudget } = require('../controllers/budgetController');

// Routes
router.post('/set', authenticateToken, setBudget);
router.get('/track', authenticateToken, trackBudget);

module.exports = router;
