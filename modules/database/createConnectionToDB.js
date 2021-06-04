const { Sequelize } = require("sequelize");
const dbConfig = require('../../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = {
    db
}