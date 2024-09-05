const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
const fs = require('fs');



exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!email.endsWith('@gmail.com')) {
        return res.status(400).json({ message: 'Email must end with @gmail.com' });
    }

    if (password.length < 8) { 
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
       
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Insert new user
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};




exports.login = async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password matches
        if (password !== user.password) { 
            return res.status(400).json({ message: 'Invalid credentials' });
        }

      
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.updateProfile = async (req, res) => {
    const userId = req.user.userId; 
    const { username, email } = req.body;
    let profilePicture;

    if (req.file) {
        profilePicture = req.file.filename;
    }

    try {
       
        let query = 'UPDATE users SET';
        const fields = [];
        if (username) fields.push(` username = '${username}'`);
        if (email) fields.push(` email = '${email}'`);
        if (profilePicture) fields.push(` profile_picture = '${profilePicture}'`);
        query += fields.join(', ') + ` WHERE id = ${userId}`;

        await pool.query(query);

        const [updatedUser] = await pool.query('SELECT id, username, email, profile_picture FROM users WHERE id = ?', [userId]);

        res.json({ message: 'Profile updated successfully', user: updatedUser[0] });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.changePassword = async (req, res) => {
    const userId = req.user.userId; 
    const { oldPassword, newPassword } = req.body;

    try {
       
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user || oldPassword !== user.password) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Update password
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};