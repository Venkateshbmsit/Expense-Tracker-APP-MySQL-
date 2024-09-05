const pool = require('../utils/db');

// Set Budget
exports.setBudget = async (req, res) => {
    const { categoryId, amount, timePeriod, startDate, endDate } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ message: 'Valid category ID is required' });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount is required and must be a positive number' });
    }
    if (!timePeriod || !['daily', 'weekly', 'monthly', 'yearly'].includes(timePeriod.toLowerCase())) {
        return res.status(400).json({ message: 'Valid time period is required (daily, weekly, monthly, yearly)' });
    }
    if (!startDate) {
        return res.status(400).json({ message: 'Start date is required' });
    }
    if (!endDate) {
        return res.status(400).json({ message: 'End date is required' });
    }
    if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: 'End date must be after start date' });
    }

    try {
        await pool.query(
            'INSERT INTO budgets (category_id, amount, time_period, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [categoryId, amount, timePeriod, startDate, endDate, userId]
        );

        res.status(201).json({ message: 'Budget set successfully' });
    } catch (error) {
        console.error('Set budget error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Track Budget
exports.trackBudget = async (req, res) => {
    const userId = req.user.userId;
    const { categoryId, timePeriod } = req.query;

    // Validation
    if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ message: 'Valid category ID is required' });
    }
    if (!timePeriod || !['daily', 'weekly', 'monthly', 'yearly'].includes(timePeriod.toLowerCase())) {
        return res.status(400).json({ message: 'Valid time period is required (daily, weekly, monthly, yearly)' });
    }

    try {
        // Retrieve budget data
        const [budgets] = await pool.query(
            'SELECT * FROM budgets WHERE user_id = ? AND category_id = ? AND time_period = ?',
            [userId, categoryId, timePeriod]
        );

        // Ensure budget exists
        if (budgets.length === 0) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        const [expenses] = await pool.query(
            'SELECT SUM(amount) AS total_spent FROM expenses WHERE user_id = ? AND category_id = ? AND DATE(date) BETWEEN ? AND ?',
            [userId, categoryId, budgets[0]?.start_date, budgets[0]?.end_date]
        );

        const budget = budgets[0];
        const totalSpent = expenses[0]?.total_spent || 0;
        const remainingBudget = budget.amount - totalSpent;

        res.json({
            categoryId,
            timePeriod,
            budget: budget.amount,
            spent: totalSpent,
            remaining: remainingBudget
        });
    } catch (error) {
        console.error('Track budget error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
