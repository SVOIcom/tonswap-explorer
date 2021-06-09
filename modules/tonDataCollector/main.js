const { eventListener, writeSwapPairEventsToDB, updateSwapPairsIfRequired } = require('./modules/event-listener');
const { createRootSwapPairContract, createSwapPairContracts } = require('./modules/initialization');
const { TonClientWrapper } = require('./modules/tonclient-wrapper');
const { db } = require("./modules/database");
const { writeLPStates } = require('./modules/event-listener/writeLiquidityStatesToDB');
const networkAddress = require('./config/network')('devnet');


/**
 * 
 * @returns {Promise<{db: Any, ton: TonClientWrapper}>}
 */
async function setup() {
    await db.sync();

    let ton = new TonClientWrapper({
        network: networkAddress,
        message_expiration_timeout: 30000
    });

    await ton.setupKeys('melody clarify hand pause kit economy bind behind grid witness cheap tomorrow');
    return {
        db,
        ton
    }
}

/**
 * @param {any} db 
 */
async function init(db) {
    let databaseModels = db.models;

    writeSwapPairEventsToDB.provideLiquidityTable = databaseModels.ProvideLiquidityEvents;
    writeSwapPairEventsToDB.swapEventsTable = databaseModels.SwapEvents;
    writeSwapPairEventsToDB.swapPairEventsTable = databaseModels.SwapPairEvents;
    writeSwapPairEventsToDB.withdrawLiquidityTable = databaseModels.WithdrawLiquidityEvents;

    writeLPStates.liquidityTable = databaseModels.SwapPairLiquidityPools;

    return {
        databaseModels,
        eventListener,
        writeSwapPairEventsToDB,
        writeLPStates
    }
}

async function initializeSmartContracts(ton, databases) {
    let rsp = await createRootSwapPairContract(ton, databases.SmartContractAddresses);
    let sps = await createSwapPairContracts(
        rsp.rootSwapPairContract,
        rsp.swapPairsInfo,
        ton,
        databases.SmartContractAddresses,
        databases.SwapPairInformation
    );

    return {
        rsp,
        sps
    }
}

async function main() {
    let { db, ton } = await setup();
    let {
        databaseModels,
        eventListener,
        writeSwapPairEventsToDB,
        writeLPStates
    } = await init(db);

    let smartContracts = await initializeSmartContracts(ton, databaseModels);
    let rootSwapPairContract = smartContracts.rsp.rootSwapPairContract;
    let swapPairs = smartContracts.sps;

    eventListener.rootSwapPairContract = rootSwapPairContract;
    eventListener.swapPairs = swapPairs;

    while (true) {
        let updatedState = await eventListener.requestStateRefresh();

        await writeSwapPairEventsToDB.writeSwapPairEvents(updatedState.events);
        await writeLPStates.writeUpdatedLPStates(updatedState.lpInfo);

        let newSwapPairs = await updateSwapPairsIfRequired(
            updatedState.rootSwapPairEvents,
            ton,
            databaseModels.SmartContractAddresses,
            databaseModels.SwapPairInformation
        );

        if (newSwapPairs.length > 0)
            eventListener.swapPairs = [...eventListener.swapPairs, ...newSwapPairs];
    }

}




if (require.main === module) {
    main();
}