const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// This middleware runs BEFORE protected route handlers
// It checks if the request has a valid JWT token
const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the header like this:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extract token (remove the word "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our secret key
      // If token is fake or expired this will throw an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user from the id inside the token
      // .select('-password') = don't include password in result
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Pass control to the next function (the actual route)
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No token found in header at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// Admin-only middleware — use AFTER protect
// Example: protect, isAdmin, deleteUser
const isAdmin = (req, res, next) => {
  // req.user is already set by protect middleware above
  if (req.user && req.user.isAdmin) {
    next(); // user is admin, allow through
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};


module.exports = { protect, isAdmin };