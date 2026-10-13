const express = require ("express");

const {
    login,
    register,
    logout,
    getCurrentUser,
} = require('../controllers/auth.controller.js')

const { authenticate } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/logout", logout);
// router.get("/me", authenticate, getCurrentUser);
// router.get('/refresh',)

module.exports = router;