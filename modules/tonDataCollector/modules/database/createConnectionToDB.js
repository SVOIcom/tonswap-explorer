// const { Sequelize } = require("sequelize");
// const dbConfig = require('../../config/db.config');

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     pool: dbConfig.pool
// });

// const db = {
//     Sequelize: Sequelize,
//     sequelize: sequelize
// };


// module.exports = {
//     db: db
// }


const Database = require('../../../database');

module.exports = {
    db: new Database(),
}