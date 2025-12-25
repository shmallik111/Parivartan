const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApplicationResponse = sequelize.define('ApplicationResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'applications',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  question_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'application_responses',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['application_id', 'question_id'],
    },
  ],
});

module.exports = ApplicationResponse;
