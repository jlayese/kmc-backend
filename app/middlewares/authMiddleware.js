const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email format"),
  profilePhoto: z.string().url("Invalid profile photo URL").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const validateSignup = async (req, res, next) => {
  try {
    console.log('Signup Validation - Request Body:', req.body);
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    req.body = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    next();
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

const validateSignin = async (req, res, next) => {
  try {
    req.body = signinSchema.parse(req.body);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      req.userData = existingUser;
      next();
    } else {
      return res.status(400).json({ error: "User not found!" });
    }
  } catch (err) {
    res.status(400).json({ error: err.errors || err.message });
  }
};



const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = await User.findById(decoded.id).select('-password'); // Attach user info to request
    if (!req.user) return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};


const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { validateSignup, validateSignin, authenticateToken, authorizeRoles };

