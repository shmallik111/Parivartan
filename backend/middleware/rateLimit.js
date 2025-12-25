const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for login endpoint
 * Prevents brute force attacks
 */
const loginLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_LOGIN_ATTEMPTS) || 5, // max 5 attempts
  message: "Too many login attempts from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => process.env.NODE_ENV === "test", // Skip in test environment
});

/**
 * Rate limiter for signup endpoint
 * Prevents spam registrations
 */
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_SIGNUP_ATTEMPTS) || 3, // max 3 attempts
  message: "Too many signup attempts from this IP, please try again after 1 hour",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

/**
 * General rate limiter for API endpoints
 * Prevents API abuse
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "test",
});

module.exports = {
  loginLimiter,
  signupLimiter,
  apiLimiter,
};
