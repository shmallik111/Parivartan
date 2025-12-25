const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // This references the table name, not the model name
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected'),
    defaultValue: 'draft',
  },
  submission_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_rejected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'applications',
  timestamps: true,
  underscored: true,
});

module.exports = Application;
