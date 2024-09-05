const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',            
    password: 'root123',    
    database: 'expense_tracker_db'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database');
        connection.release(); // Release the connection back to the pool
    }
});

module.exports = pool.promise();
