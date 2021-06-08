const { converter } = require("../utils");
const { SWAP_EVENT_NAME, PROVIDE_LIQUIDITY_EVENT_NAME, WITHDRAW_LIQUIDITY_EVENT_NAME } = require("../utils/constants");

const writeSwapPairEventsToDB = {
    /**
     * @type {SwapPairEvents}
     */
    swapPairEventsTable: undefined,
    /**
     * @type {SwapEvents}
     */
    swapEventsTable: undefined,
    /**
     * @type {ProvideLiquidityEvents}
     */
    provideLiquidityTable: undefined,
    /**
     * @type {WithdrawLiquidityEvents}
     */
    withdrawLiquidityTable: undefined,

    /**
     * 
     * @param {Array<import("../smart-contract-wrapper/contract").EventType>} events 
     */
    writeSwapPairEvents: async function(events) {
        let swapPairEvents = events
            .map((element) => converter.swapPairEventsInfoToDB(element));

        let swapEvents = events
            .filter((element) => element.name == SWAP_EVENT_NAME)
            .map((element) => converter.swapEventInfoToDB(element));

        let provideEvents = events
            .filter((element) => element.name == PROVIDE_LIQUIDITY_EVENT_NAME)
            .map((element) => converter.provideLiquidityInfoToDB(element));

        let withdrawEvents = events
            .filter((element) => element.name == WITHDRAW_LIQUIDITY_EVENT_NAME)
            .map((element) => converter.withdrawLiquidityInfotoDB(element));

        await this.swapPairEventsTable.bulkCreate(swapPairEvents, {
            ignoreDuplicates: true
        });
        await this.swapEventsTable.bulkCreate(swapEvents, {
            ignoreDuplicates: true
        });
        await this.provideLiquidityTable.bulkCreate(provideEvents, {
            ignoreDuplicates: true
        });
        await this.withdrawLiquidityTable.bulkCreate(withdrawEvents, {
            ignoreDuplicates: true
        });
    }
}

module.exports = writeSwapPairEventsToDB;