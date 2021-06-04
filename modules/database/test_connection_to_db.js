const { eventListener, writeSwapPairEventsToDB } = require('../event-listener');
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
    //     address: '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2',
    //     smart_contract_type: 1
    // });
    // console.log(JSON.stringify(await SmartContractAddresses.findOne({ where: { smart_contract_type: 1 } }), null, '\t'));
    // console.log(await SmartContractAddresses.safeAddByAddress('0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e3', {
    //     address: '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e3',
    //     smart_contract_type: 1
    // }));
    // await SwapPairInformation.create({
    //     id: 2,
    //     swap_pair_address: "0:67e4698e0c902bde3763702576b1fdf798ed300dbf326ea52f3aa78b50519858",
    //     root_address: "0:0daaca36b1d25699eaa0f40276830d2b263d9db41dfe590c2eb13a145a3caf6a",
    //     token1_address: "0:4d128ff78d0dff4c29b8a3618e8c5053f240cbf97978773ee41a3be6d6f97f77",
    //     token2_address: "0:4c28e896363e142429488f0f2d8f604f6e867addc302080be73b1a4c50594325",
    //     lptoken_address: "0:7dba655cb532e5b66d56b9ddccc910d950af4e1c8c75923b68ec72993936506f",
    //     wallet1_address: "0:a70f7436d01de5b2ed3fe7c0e73af8e6fce67bb55bde2c0e89c77600ef95714c",
    //     wallet2_address: "0:3369fcdfcc97fca9bbaf41baee9d2197ad5a49a7fb2ffe93a7b7f4b43dc0d459",
    //     lptoken_wallet_address: "0:3e393ed196ca49772760820f2ccc2fc818093616b6c056d68186c96bdfaf1651",
    //     swap_pair_name: "Coin_3731_1_2<->Coin_46871_1 LPT",
    // });
    let rsp = await createRootSwapPairContract(ton, SmartContractAddresses);
    let sps = await createSwapPairContracts(rsp.rootSwapPairContract, rsp.swapPairsInfo, ton, SmartContractAddresses, SwapPairInformation);

    eventListener.rootSwapPairContract = rsp.rootSwapPairContract;
    eventListener.swapPairs = sps;

    let updatedState = await eventListener.requestStateRefresh();

    writeSwapPairEventsToDB.provideLiquidityTable = ProvideLiquidityEvents;
    writeSwapPairEventsToDB.swapEventsTable = SwapEvents;
    writeSwapPairEventsToDB.swapPairEventsTable = SwapPairEvents;
    writeSwapPairEventsToDB.withdrawLiquidityTable = WithdrawLiquidityEvents;
    await writeSwapPairEventsToDB.writeSwapPairEvents(updatedState.events);


    await db.sequelize.close();
    process.exit();
}

test()