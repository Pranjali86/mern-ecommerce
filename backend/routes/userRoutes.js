const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes — anyone can access these
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route — only logged in users
// protect middleware runs first, then getUserProfile
router.get('/profile', protect, getUserProfile);

module.exports = router;