const express = require('express');
const router = express.Router();
const { addCategory, editCategory, deleteCategory, getCategories } = require('../controllers/categoryController');
const authenticateToken = require('../middlewares/authenticateToken');

// Add new category
router.post('/', authenticateToken, addCategory);

// Edit category
router.put('/:id', authenticateToken, editCategory);

// Delete category
router.delete('/:id', authenticateToken, deleteCategory);

// Retrieve categories
router.get('/', authenticateToken, getCategories);

module.exports = router;
