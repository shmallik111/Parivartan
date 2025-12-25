/**
 * Database Schema Migrations
 * Run these migrations in order to update your database
 */

-- ============================================
-- Migration 1: Add email verification columns
-- ============================================
-- ADD THIS TO YOUR DATABASE:
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMP;

-- Create index for faster verification token lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- ============================================
-- Migration 2: Create password reset tokens table
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- ============================================
-- Migration 3: Add rejection reason column
-- ============================================
-- This is already in the database schema, but verify:
-- ALTER TABLE applications 
-- ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ============================================
-- Migration 4: Add indexes for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_applications_user_id_status ON applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_form_id_status ON applications(form_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_is_rejected ON applications(is_rejected);

-- ============================================
-- To apply migrations:
-- 1. Connect to your PostgreSQL database
-- 2. Run each SQL section manually or use a migration tool like Flyway/Liquibase
-- 3. Verify the changes with: \d users (in psql)
-- ============================================
