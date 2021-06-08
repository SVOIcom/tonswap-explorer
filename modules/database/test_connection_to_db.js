const { eventListener, writeSwapPairEventsToDB, updateSwapPairsIfRequired } = require('../event-listener');
const { writeLPStates } = require('../event-listener/writeLiquidityStatesToDB');
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

    console.log(await SmartContractAddresses.findOne({ where: { id: 2 } }));

    // let ton = new TonClientWrapper({
    //     network: networkAddress,
    //     message_expiration_timeout: 30000
    // });

    // await ton.setupKeys('melody clarify hand pause kit economy bind behind grid witness cheap tomorrow');

    // let rsp = await createRootSwapPairContract(ton, SmartContractAddresses);
    // let sps = await createSwapPairContracts(rsp.rootSwapPairContract, rsp.swapPairsInfo, ton, SmartContractAddresses, SwapPairInformation);

    // eventListener.rootSwapPairContract = rsp.rootSwapPairContract;
    // eventListener.swapPairs = sps;

    // writeSwapPairEventsToDB.provideLiquidityTable = ProvideLiquidityEvents;
    // writeSwapPairEventsToDB.swapEventsTable = SwapEvents;
    // writeSwapPairEventsToDB.swapPairEventsTable = SwapPairEvents;
    // writeSwapPairEventsToDB.withdrawLiquidityTable = WithdrawLiquidityEvents;

    // writeLPStates.liquidityTable = SwapPairLiquidityPools;

    // let updatedState = await eventListener.requestStateRefresh();

    // await writeSwapPairEventsToDB.writeSwapPairEvents(updatedState.events);
    // await writeLPStates.writeUpdatedLPStates(updatedState.lpInfo);

    // let nsp = await updateSwapPairsIfRequired(updatedState.rootSwapPairEvents, ton, SmartContractAddresses, SwapPairInformation);
    // eventListener.swapPairs = [...eventListener.swapPairs, ...nsp];

    await db.sequelize.close();
    process.exit();
}

test()