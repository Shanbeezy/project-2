
//we need this page to connect to the database//
const Sequelize = require('sequelize');
require('dotenv').config();

// connection.js
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;
