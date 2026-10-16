const express = require('express');
const { z } = require('zod');

const {
  login,
  register,
  logout,
  getCurrentUser,
  refreshSession,
} = require('../controllers/auth.controller.js');

const {
  authenticate,
  authenticateRefreshToken,
} = require("../middleware/auth.middleware.js");
const { validate } = require('../middleware/validation.middleware.js');

const router = express.Router();

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

router.get("/me", authenticate, getCurrentUser);
router.post("/refresh", authenticateRefreshToken, refreshSession);

module.exports = router;