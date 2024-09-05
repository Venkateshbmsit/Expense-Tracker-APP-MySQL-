const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');


const {
    addExpense,
    editExpense,
    deleteExpense,
    getExpenses,
    addRecurringExpense
} = require('../controllers/expenseController');

// Apply authentication middleware
router.post('/', authenticateToken, addExpense); // Note: changed from /expense to /
router.put('/:id', authenticateToken, editExpense);
router.delete('/:id', authenticateToken, deleteExpense);
router.get('/', authenticateToken, getExpenses);
router.post('/recurring-expense', authenticateToken, addRecurringExpense);

module.exports = router;
