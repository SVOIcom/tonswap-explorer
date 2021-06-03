const { createRootSwapPairContract, createSwapPairContracts } = require('../initialization');
const { TonClientWrapper } = require('../tonclient-wrapper');
const { db } = require("./createConnectionToDB");

const {
    SmartContractAddresses,
    SwapPairInformation,
    SwapPairEvents,
    SwapPairLiquidityPools,
    SwapEvents,
    ProvideLiquidityEvents,
    WithdrawLiquidityEvents
} = require('./databaseModels')(db.sequelize);

const networkAddress = require('../../config/network')('devnet');

async function test() {
    await db.sequelize.sync();
    await db.sequelize.query('show tables').then(console.log);

    let ton = new TonClientWrapper({
        network: networkAddress,
        message_expiration_timeout: 30000
    });

    await ton.setupKeys('melody clarify hand pause kit economy bind behind grid witness cheap tomorrow');
    // await SmartContractAddresses.create({
    //     id: 1,
    //     address: '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2',
    //     smart_contract_type: 1
    // });
    //console.log(JSON.stringify(await SmartContractAddresses.findOne({ where: { smart_contract_type: 1 } }), null, '\t'));
    // console.log(await SmartContractAddresses.safeAddByAddress('0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e3', {
    //     address: '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e3',
    //     smart_contract_type: 1
    // }));
    let rsp = await createRootSwapPairContract(ton, SmartContractAddresses);
    let sps = await createSwapPairContracts(rsp.rootSwapPairContract, rsp.swapPairsInfo, ton, SmartContractAddresses);
    await db.sequelize.close();
    process.exit();
}

test()