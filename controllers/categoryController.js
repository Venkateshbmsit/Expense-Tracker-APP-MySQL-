const pool = require('../utils/db');

exports.addCategory = async (req, res) => {
    const { name, icon } = req.body;
    const userId = req.user.userId; 

    // Validate input
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required' });
    }
    if (!icon || icon.trim() === '') {
        return res.status(400).json({ message: 'Category icon is required' });
    }

    try {
        const [result] = await pool.query('INSERT INTO categories (name, icon, user_id) VALUES (?, ?, ?)', [name, icon, userId]);
        res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
    } catch (error) {
        console.error('Add category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.editCategory = async (req, res) => {
    const { id } = req.params;
    const { name, icon } = req.body;

    // Validate input
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Category name is required' });
    }
    if (!icon || icon.trim() === '') {
        return res.status(400).json({ message: 'Category icon is required' });
    }

    try {
        // Check if category exists
        const [existingCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (existingCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Update the category
        await pool.query('UPDATE categories SET name = ?, icon = ? WHERE id = ?', [name, icon, id]);
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Edit category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if category exists
        const [existingCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (existingCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete the category
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getCategories = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [categories] = await pool.query('SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL', [userId]);
        res.json(categories);
    } catch (error) {
        console.error('Retrieve categories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


