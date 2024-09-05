require('dotenv').config();
const express = require('express');
const app = express();
const categoryRoutes = require('./routes/category');
const expenseRoutes = require('./routes/expense');
const authenticateToken = require('./middlewares/authenticateToken');
const budgetRoutes = require('./routes/budget');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/reports');

// Middleware
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/category', authenticateToken, categoryRoutes);
app.use('/api/expense', authenticateToken, expenseRoutes);
app.use('/api/budget', authenticateToken, budgetRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/uploads', express.static('uploads'));

// Start Server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
