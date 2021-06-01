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

const {
    SmartContractAddresses,
    SwapPairInformation,
    SwapPairEvents,
    SwapPairLiquidityPools,
    SwapEvents,
    ProvideLiquidityEvents,
    WithdrawLiquidityEvents
} = require('./databaseModels')(db.sequelize);

async function test() {
    await db.sequelize.sync();
    await db.sequelize.query('show tables').then(console.log);
    await db.sequelize.close();
}

test()