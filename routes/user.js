const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg, and .jpeg format allowed!'));
        }
    }
});


router.post('/register', register);
router.post('/login', login);
router.put('/profile', authenticateToken, upload.single('profilePicture'), updateProfile);

router.put('/change-password', authenticateToken, changePassword);


module.exports = router;
