const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'password_reset_tokens',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['token'],
      unique: true,
    },
    {
      fields: ['user_id'],
    },
    {
      fields: ['expires_at'],
    },
  ],
});

// Add instance method to check if token is expired
PasswordResetToken.prototype.isExpired = function() {
  return new Date() > this.expires_at;
};

// Add instance method to mark token as used
PasswordResetToken.prototype.markAsUsed = async function() {
  this.used_at = new Date();
  await this.save();
};

module.exports = PasswordResetToken;
