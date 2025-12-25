const { sequelize } = require('./config/database');
const User = require('./models/User');

async function testConnection() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');

    // Test creating a user
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User'
    });
    console.log('✅ Test user created:', user.toJSON());

    // Find the user
    const foundUser = await User.findOne({ where: { email: 'test@example.com' } });
    console.log('✅ Found user:', foundUser ? foundUser.toJSON() : 'Not found');

    // Verify password
    const isValid = await foundUser.validPassword('password123');
    console.log('✅ Password verification:', isValid ? '✅ Success' : '❌ Failed');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

testConnection();
