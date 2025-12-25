const { Pool } = require("pg");
require("dotenv").config();

// Build connection config - supports both CONNECTION STRING and individual parameters
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use connection string (recommended for cloud databases like Supabase)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase
    },
  };
  console.log("📡 Using DATABASE_URL connection string");
} else {
  // Use individual parameters (for local development)
  poolConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "techleadhers_db",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
  };

  // Add SSL config if enabled
  if (process.env.DB_SSL === "true") {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }
  console.log(`📡 Using individual DB parameters (Host: ${poolConfig.host})`);
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Initialize database tables
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS forms (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id),
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        required BOOLEAN DEFAULT TRUE,
        options JSONB,
        correct_answer VARCHAR(255),
        is_knockout BOOLEAN DEFAULT FALSE,
        order_num INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        form_id INTEGER NOT NULL REFERENCES forms(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        answers JSONB NOT NULL,
        is_rejected BOOLEAN DEFAULT FALSE,
        rejection_reason TEXT,
        status VARCHAR(50) DEFAULT 'submitted',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_forms_created_by ON forms(created_by);
      CREATE INDEX IF NOT EXISTS idx_questions_form_id ON questions(form_id);
      CREATE INDEX IF NOT EXISTS idx_applications_form_id ON applications(form_id);
      CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
    `);
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Run initialization when module loads
if (process.env.NODE_ENV !== "test") {
  initDatabase();
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
