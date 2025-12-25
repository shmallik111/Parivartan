#!/usr/bin/env node
/**
 * Seed script to create the first super-admin user
 * Usage: node backend/seed-admin.js
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/database");

const createSuperAdmin = async () => {
  try {
    const email = "admin@techleadhers.com";
    const password = "TechLeaders123";
    const fullName = "TechLeadHers Admin";

    console.log("🔐 Creating super-admin user...");

    // Check if admin already exists
    const existingAdmin = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      console.log("✅ Admin user already exists!");
      console.log(`   Email: ${email}`);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert super-admin user
    const result = await db.query(
      `INSERT INTO users (email, password, full_name, role, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, email, full_name, role`,
      [email, hashedPassword, fullName, "super-admin"]
    );

    const admin = result.rows[0];

    console.log("\n✅ Super-admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.full_name}`);
    console.log(`   Role:  ${admin.role}`);
    console.log(`\n🔑 Password: ${password}`);
    console.log("\n⚠️  IMPORTANT: Change this password immediately after first login!");
    console.log("\n✅ Setup complete! You can now:");
    console.log("   1. Login with the credentials above");
    console.log("   2. Create forms and manage applications");
    console.log("   3. Promote other users to admin role");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating super-admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
