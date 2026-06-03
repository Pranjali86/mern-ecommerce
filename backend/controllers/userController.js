const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// ── HELPER: generate JWT token ──────────────────────────
// We'll call this in both register and login
const generateToken = (id) => {
    return jwt.sign(
        { id }, // payload — what we store inside the token
        process.env.JWT_SECRET, // secret key from .env
        { expiresIn: '30d' } // token expires in 30 days
    );
};


// ── REGISTER ────────────────────────────────────────────
// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create user (password is auto-hashed by our pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Send back user info + token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // JWT token
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── LOGIN ───────────────────────────────────────────────
// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      // Deliberately vague — don't tell attacker which was wrong
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── GET PROFILE ─────────────────────────────────────────
// GET /api/users/profile  (protected route)
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware (next file)
    const user = await User.findById(req.user.id).select('-password');
    // .select('-password') = return everything EXCEPT password

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerUser, loginUser, getUserProfile };