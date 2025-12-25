const nodemailer = require("nodemailer");

/**
 * Email service for sending password reset and verification emails
 */

let transporter;

const initializeEmailService = () => {
  // Configure SMTP transporter
  if (process.env.SENDGRID_API_KEY) {
    // Using SendGrid
    transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Using SMTP (Gmail or other)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
};

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's full name
 */
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    if (!transporter) {
      initializeEmailService();
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@techleadhers.com",
      to: email,
      subject: "Password Reset Request - TechLeadHers",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetLink}</p>
        <p><strong>This link will expire in 15 minutes.</strong></p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Best regards,<br>TechLeadHers Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw error;
  }
};

/**
 * Send email verification email
 * @param {string} email - User's email address
 * @param {string} verificationToken - Email verification token
 * @param {string} userName - User's full name
 */
const sendVerificationEmail = async (email, verificationToken, userName) => {
  try {
    if (!transporter) {
      initializeEmailService();
    }

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@techleadhers.com",
      to: email,
      subject: "Verify Your Email - TechLeadHers",
      html: `
        <h2>Email Verification</h2>
        <p>Hi ${userName},</p>
        <p>Welcome to TechLeadHers! Please verify your email address by clicking the link below:</p>
        <p>
          <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verifyLink}</p>
        <p><strong>This link will expire in 24 hours.</strong></p>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>Best regards,<br>TechLeadHers Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw error;
  }
};

/**
 * Send application status email
 * @param {string} email - User's email address
 * @param {string} status - Application status (approved/rejected)
 * @param {string} formTitle - Form/application title
 * @param {string} rejectionReason - Reason for rejection (if applicable)
 */
const sendApplicationStatusEmail = async (email, status, formTitle, rejectionReason = null) => {
  try {
    if (!transporter) {
      initializeEmailService();
    }

    const isApproved = status === "approved";
    const subject = isApproved 
      ? `Application Approved - ${formTitle}` 
      : `Application Rejected - ${formTitle}`;

    const html = isApproved
      ? `
        <h2>Application Approved! 🎉</h2>
        <p>Your application for <strong>${formTitle}</strong> has been approved!</p>
        <p>We look forward to working with you. Check your account for next steps.</p>
      `
      : `
        <h2>Application Status Update</h2>
        <p>Your application for <strong>${formTitle}</strong> has been reviewed.</p>
        <p><strong>Status:</strong> Rejected</p>
        ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
        <p>You may apply again in the future. Feel free to reach out if you have any questions.</p>
      `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@techleadhers.com",
      to: email,
      subject,
      html: `
        ${html}
        <p>Best regards,<br>TechLeadHers Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Application status email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending application status email:", error);
    throw error;
  }
};

module.exports = {
  initializeEmailService,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendApplicationStatusEmail,
};
