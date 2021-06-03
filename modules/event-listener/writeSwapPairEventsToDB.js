const { converter } = require("../utils");

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
        let swapPairEvents = events.map((element) => { return converter.swapPairEventsInfoToDB(element) });
        let swapEvents = events
            .filter((element) => { element.name == 'Swap' })
            .map((element) => { return converter.swapEventInfoToDB(element) });
        let provideEvents = events
            .filter((element) => { element.name == 'ProvideLiquidity' })
            .map((element) => { return converter.provideLiquidityInfoToDB(element) });
        let withdrawEvents = events
            .filter((element) => { element.name == 'WithdrawLiquidity' })
            .map((element) => { return converter.withdrawLiquidityInfotoDB(element) });

        await this.swapPairEventsTable.bulkCreate(swapPairEvents);
        await this.swapEventsTable.bulkCreate(swapEvents);
        await this.provideLiquidityTable.bulkCreate(provideEvents);
        await this.withdrawEventsTable.bulkCreate(withdrawEvents);
    }
}

module.exports = writeSwapPairEventsToDB;