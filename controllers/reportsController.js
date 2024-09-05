const pool = require('../utils/db');
const { generatePDFReport, generateCSVReport } = require('../utils/reportGenerator');


exports.generateReport = async (req, res) => {
    const { startDate, endDate, format } = req.body;
    const userId = req.user.userId;
    const username = req.user.username; 

    try {
        
        const [expenses] = await pool.query(
            'SELECT * FROM expenses WHERE user_id = ? AND date BETWEEN ? AND ?',
            [userId, startDate, endDate]
        );

        let report;

        // Check which format the user requested
        if (format === 'PDF') {
            report = await generatePDFReport(expenses, username);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=expense_report.pdf');
        } else if (format === 'CSV') {
            report = await generateCSVReport(expenses, username);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=expense_report.csv');
        } else {
            return res.status(400).json({ error: 'Invalid format' });
        }

      
        res.send(report);
    } catch (error) {
        console.error('Generate report error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
