const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    contactNumber: z
      .string()
      .min(10, "Contact number must be at least 10 digits"),
    email: z.string().email("Invalid email format"),
    profilePhoto: z.string().url("Invalid profile photo URL").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const validateSignup = async (req, res, next) => {
  try {
    req.body = signupSchema.parse(req.body);

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors || err.message,
    });
  }
};

const validateSignin = async (req, res, next) => {
  try {
    req.body = signinSchema.parse(req.body);

    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    if (!existingUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    } else if (existingUser.isDeleted) {
      return res
        .status(403)
        .json({ success: false, message: "Your account has been deleted." });
    } else if (!existingUser.isApproved) {
      return res
        .status(403)
        .json({ success: false, message: "Your account is not approved yet." });
    }

    req.userData = existingUser;
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.errors || err.message,
    });
  }
};

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }
    console.log('authenticateToken ', req.user)

    next();
  } catch (err) {
    console.log(err)
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Insufficient permissions",
      });
    }
    next();
  };
};

module.exports = {
  validateSignup,
  validateSignin,
  authenticateToken,
  authorizeRoles,
};
