const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// Convert callback-based crypto functions to promise-based
const randomBytes = promisify(crypto.randomBytes);

/**
 * Generate a cryptographically secure random token
 * @returns {Promise<string>} A promise that resolves to a hex-encoded random string
 */
const generateToken = async () => {
  try {
    const buffer = await randomBytes(32);
    return buffer.toString('hex');
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate secure token');
  }
};

/**
 * Hash a token using SHA-256
 * @param {string} token - The token to hash
 * @returns {string} Hex-encoded hash of the token
 */
const hashToken = (token) => {
  if (!token) throw new Error('Token is required for hashing');
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a JWT token for authentication
 * @param {Object} payload - The payload to include in the token
 * @param {string} secret - The secret key for signing
 * @param {string|number} expiresIn - Expiration time (e.g., '1h', '7d')
 * @returns {string} JWT token
 */
const generateJWT = (payload, secret, expiresIn = '7d') => {
  return jwt.sign(
    { ...payload },
    secret,
    { expiresIn }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - The JWT token to verify
 * @param {string} secret - The secret key for verification
 * @returns {Promise<Object>} The decoded token payload
 */
const verifyJWT = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

module.exports = {
  generateToken,
  hashToken,
  generateJWT,
  verifyJWT
};
