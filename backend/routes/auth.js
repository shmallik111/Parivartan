const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateSignup } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");
const { loginLimiter, signupLimiter } = require("../middleware/rateLimit");

// Public routes with rate limiting
router.post("/signup", signupLimiter, validateSignup, authController.signup);
router.post("/login", loginLimiter, authController.login);

// Password reset routes (public, for unauthenticated users)
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

// Email verification routes (public)
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification-email", authController.resendVerificationEmail);

// Protected routes
router.get("/profile", authenticateToken, authController.getProfile);

// Admin routes - promote/demote users
router.post("/:userId/promote-admin", authenticateToken, authController.promoteToAdmin);
router.post("/:userId/demote-admin", authenticateToken, authController.demoteFromAdmin);

module.exports = router;
