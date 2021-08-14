const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('nodejs-complete', 'root', 'admin', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
