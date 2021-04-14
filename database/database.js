const { Sequelize } = require('sequelize');

const connection = new Sequelize('FEvBEqc3CZ', 'FEvBEqc3CZ','DP7eGWkqcJ', {
    host: 'remotemysql.com',
    dialect: 'mysql'
});

module.exports = connection;
