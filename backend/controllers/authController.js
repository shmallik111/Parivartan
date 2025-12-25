const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { generateToken: generateRandomToken } = require('../utils/tokenUtils');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../utils/emailService');
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Generate email verification token
    const verificationToken = generateRandomToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      email,
      password, // Will be hashed by the model hook
      full_name,
      role: 'user',
      verification_token: verificationToken,
      verification_token_expires_at: verificationTokenExpires,
      is_email_verified: false
    });

    const token = generateToken(user);

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, full_name);
    } catch (emailError) {
      console.error('Warning: Failed to send verification email:', emailError);
      // Don't fail signup if email sending fails, but log it
    }

    res.status(201).json({
      message: "User created successfully. Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        is_email_verified: user.is_email_verified,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await db.query("SELECT id, email, full_name, role, created_at FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow super-admin or already-admin users to promote others
    if (req.user.role !== "super-admin" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check if user exists
    const userResult = await db.query("SELECT id, email, role FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Don't allow promoting already-admin users
    if (user.role === "admin" || user.role === "super-admin") {
      return res.status(400).json({ error: "User is already an admin" });
    }

    // Promote to admin
    const result = await db.query(
      "UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, full_name, role",
      ["admin", userId]
    );

    res.json({
      message: "User promoted to admin successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Promote to admin error:", error);
    res.status(500).json({ error: "Failed to promote user" });
  }
};

const demoteFromAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only super-admin can demote
    if (req.user.role !== "super-admin") {
      return res.status(403).json({ error: "Super admin access required" });
    }

    // Check if user exists
    const userResult = await db.query("SELECT id, email, role FROM users WHERE id = $1", [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    // Don't allow demoting non-admin users
    if (user.role === "user") {
      return res.status(400).json({ error: "User is not an admin" });
    }

    // Demote to user
    const result = await db.query(
      "UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, full_name, role",
      ["user", userId]
    );

    res.json({
      message: "User demoted to user successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Demote from admin error:", error);
    res.status(500).json({ error: "Failed to demote user" });
  }
};

/**
 * Request password reset
 * Sends email with reset token
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const userResult = await db.query("SELECT id, full_name FROM users WHERE email = $1", [email]);

    // Don't reveal if email exists (security best practice)
    if (userResult.rows.length === 0) {
      return res.status(200).json({ 
        message: "If this email exists, you will receive a password reset link" 
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = generateRandomToken();
    const hashedToken = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to database
    await db.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, hashedToken, expiresAt]
    );

    // Send email
    await sendPasswordResetEmail(email, resetToken, user.full_name);

    res.json({ 
      message: "Password reset email sent. Please check your inbox.",
      email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") // Mask email for privacy
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ error: "Failed to process password reset request" });
  }
};

/**
 * Reset password with token
 */
const resetPassword = async (req, res) => {
  const client = await db.getClient();
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "Token and new password required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Validate password strength
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters with uppercase and number" 
      });
    }

    await client.query("BEGIN");

    // Find valid reset token
    const hashedToken = hashToken(token);
    const tokenResult = await client.query(
      "SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used_at IS NULL",
      [hashedToken]
    );

    if (tokenResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const userId = tokenResult.rows[0].user_id;

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, userId]
    );

    // Mark token as used
    await client.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE token = $1",
      [hashedToken]
    );

    await client.query("COMMIT");

    res.json({ message: "Password reset successfully. You can now login with your new password." });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }

    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  } finally {
    client.release();
  }
};

/**
 * Verify email with token
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Verification token is required" });
    }

    // Find user with this verification token
    const userResult = await db.query(
      "SELECT id, email, verification_token_expires_at FROM users WHERE verification_token = $1",
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    const user = userResult.rows[0];

    // Check if token has expired
    if (new Date(user.verification_token_expires_at) < new Date()) {
      return res.status(400).json({ error: "Verification token has expired" });
    }

    // Mark email as verified
    await db.query(
      "UPDATE users SET is_email_verified = TRUE, email_verified_at = NOW(), verification_token = NULL, verification_token_expires_at = NULL WHERE id = $1",
      [user.id]
    );

    res.json({ 
      message: "Email verified successfully. You can now use all features.",
      email: user.email 
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
};

/**
 * Resend verification email
 */
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const userResult = await db.query(
      "SELECT id, full_name, is_email_verified FROM users WHERE email = $1",
      [email]
    );

    // Don't reveal if email exists
    if (userResult.rows.length === 0) {
      return res.status(200).json({ 
        message: "If this email exists and is not verified, a verification email will be sent" 
      });
    }

    const user = userResult.rows[0];

    // Check if already verified
    if (user.is_email_verified) {
      return res.status(400).json({ error: "This email is already verified" });
    }

    // Generate new verification token
    const verificationToken = generateRandomToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    await db.query(
      "UPDATE users SET verification_token = $1, verification_token_expires_at = $2 WHERE id = $3",
      [verificationToken, verificationTokenExpires, user.id]
    );

    // Send email
    await sendVerificationEmail(email, verificationToken, user.full_name);

    res.json({ 
      message: "Verification email sent. Please check your inbox.",
      email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") // Mask email for privacy
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  promoteToAdmin,
  demoteFromAdmin,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
