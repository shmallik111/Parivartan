/**
 * Test Supabase Connection
 * Run with: node test-connection.js
 */

require("dotenv").config();
const { Pool } = require("pg");

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

if (process.env.DB_SSL === "true") {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

console.log("Testing Supabase Connection...");
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Port: ${process.env.DB_PORT}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`SSL: ${process.env.DB_SSL}`);
console.log("");

const pool = new Pool(poolConfig);

pool
  .query("SELECT version();")
  .then((result) => {
    console.log("✅ Connection Successful!");
    console.log("Server Version:", result.rows[0].version);
    console.log("");
    console.log("Next Steps:");
    console.log("1. Run 'npm run dev' to start the server");
    console.log("2. The database tables will be created automatically on startup");
    console.log("3. Test with: curl http://localhost:5000/api/health");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Connection Failed!");
    console.error("Error:", error.message);
    console.error("");
    console.error("Troubleshooting:");
    console.error("1. Check if Supabase database is running");
    console.error("2. Verify credentials in .env file");
    console.error("3. Ensure .env has DB_SSL=true for Supabase");
    console.error("4. Check if your IP is whitelisted in Supabase");
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
