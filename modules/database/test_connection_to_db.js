const { Sequelize } = require("sequelize");
const { fetchInitialData } = require(".");

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
    // await SmartContractAddresses.create({
    //     id: 1,
    //     address: '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2',
    //     smart_contract_type: 1
    // });
    //console.log(JSON.stringify(await SmartContractAddresses.findOne({ where: { smart_contract_type: 1 } }), null, '\t'));
    console.log(await fetchInitialData(SmartContractAddresses));
    await db.sequelize.close();
}

test()