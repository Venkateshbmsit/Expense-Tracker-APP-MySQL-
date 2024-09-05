const pool = require('../utils/db');

// Add New Expense
exports.addExpense = async (req, res) => {
    const { amount, category_id, date, notes, paymentMethod } = req.body;
    const userId = req.user.userId;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount is required and must be a positive number' });
    }
    if (!category_id || category_id.trim() === '') {
        return res.status(400).json({ message: 'Category ID is required' });
    }
    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }
    if (!notes || notes.trim() === '') {
        return res.status(400).json({ message: 'Notes are required' });
    }
    if (!paymentMethod || paymentMethod.trim() === '') {
        return res.status(400).json({ message: 'Payment Method is required' });
    }

    try {
        await pool.query(
            'INSERT INTO expenses (amount, category_id, user_id, date, notes, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
            [amount, category_id, userId, date, notes, paymentMethod]
        );
        res.status(201).json({ message: 'Expense added successfully' });
    } catch (error) {
        console.error('Add expense error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Edit Expense 
exports.editExpense = async (req, res) => {
    const  expenseId = req.params.id;
    const { amount, categoryId, date, notes, paymentMethod } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount is required and must be a positive number' });
    }
    if (!categoryId || categoryId.trim() === '') {
        return res.status(400).json({ message: 'Category ID is required' });
    }
    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }
    if (!notes || notes.trim() === '') {
        return res.status(400).json({ message: 'Notes are required' });
    }
    if (!paymentMethod || paymentMethod.trim() === '') {
        return res.status(400).json({ message: 'Payment Method is required' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE expenses SET amount = ?, category_id = ?, date = ?, notes = ?, payment_method = ? WHERE id = ?',
            [amount, categoryId, date, notes, paymentMethod, expenseId]
        );

        console.log('Update result:', result);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Expense not found' });
        } else {
            res.json({ message: 'Expense updated successfully' });
        }
    } catch (error) {
        console.error('Edit expense error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Delete Expense
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM expenses WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

       
        const [result] = await pool.query('DELETE FROM expenses WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }

    
        res.json({
            message: 'Expense deleted successfully',
            deletedExpense: rows[0]
        });
    } catch (error) {
        console.error('Delete expense error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



// Retrieve Expenses Endpoint
exports.getExpenses = async (req, res) => { 
    const userId = req.user.userId; 
    const { startDate, endDate, category } = req.query;

    let query = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [userId];

    if (startDate && endDate) {
        query += ' AND date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    try {
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Retrieve expenses error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.addRecurringExpense = async (req, res) => {
    const { amount, categoryId, frequency, startDate, endDate } = req.body;

    // Validate input
    if (!amount || !categoryId || !frequency || !startDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
   
        await pool.query(
            'INSERT INTO recurring_expenses (user_id, amount, category_id, frequency, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, amount, categoryId, frequency, startDate, endDate]
        );

        res.status(201).json({ message: 'Recurring expense added successfully' });
    } catch (error) {
        console.error('Add recurring expense error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};





