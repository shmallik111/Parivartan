const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

// Public routes
router.post("/signup", validateSignup, authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);

module.exports = router;
