const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

// Initialize database models and relationships
const initDatabase = async () => {
  try {
    await testConnection();
    
    // Import models
    const User = require('../models/User');
    const Application = require('../models/Application');
    const ApplicationResponse = require('../models/ApplicationResponse');
    const PasswordResetToken = require('../models/PasswordResetToken');
    
    // Define relationships
    User.hasMany(Application, { foreignKey: 'user_id' });
    Application.belongsTo(User, { foreignKey: 'user_id' });
    
    Application.hasMany(ApplicationResponse, { foreignKey: 'application_id' });
    ApplicationResponse.belongsTo(Application, { foreignKey: 'application_id' });
    
    User.hasOne(PasswordResetToken, { foreignKey: 'user_id' });
    PasswordResetToken.belongsTo(User, { foreignKey: 'user_id' });
    
    // Sync all models with the database
    // In development, this will create tables if they don't exist
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('✅ Database tables synchronized');
    
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Run initialization when module loads
if (process.env.NODE_ENV !== 'test') {
  initDatabase().catch(console.error);
}

module.exports = {
  sequelize,
  Sequelize,
  initDatabase,
  testConnection
};
