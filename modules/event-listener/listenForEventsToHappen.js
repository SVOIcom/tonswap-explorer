const refreshSettings = require("../../config/refreshSettings");
const { SwapPairContract, RootSwapPairContract } = require("../smart-contract-interaction");

const eventListener = {
    /**
     * @type {Array<SwapPairContract>} 
     */
    swapPairs: [],
    /**
     * @type {RootSwapPairContract}
     */
    rootSwapPairContract: undefined,

    /**
     * 
     * @returns {Promise<{events: Array<import("../smart-contract-wrapper/contract").EventType>, lpInfo: Array<Object>, rootSwapPairEvents}>}
     */
    requestStateRefresh: async function() {
        let eventBatches = [];
        let lpInfoBatches = [];
        let rootSwapPairEvents = [];

        if (this.swapPairs.length > 0) {
            for (let batchIndex = 0; batchIndex < Math.ceil(this.swapPairs.length / refreshSettings.swapPairsPerBatch); batchIndex++) {
                /**
                 * @type {Array<SwapPairContract>}
                 */
                let swapPairsToRefresh = this.swapPairs.slice(
                    batchIndex * refreshSettings.swapPairsPerBatch,
                    (batchIndex + 1) * refreshSettings.swapPairsPerBatch
                );

                let eventPromises = [];
                for (let swapPair of swapPairsToRefresh)
                    eventPromises.push(swapPair.getLatestEvents());

                // TODO: посмотреть вариант с Promise.allSettled
                eventPromises = await Promise.all(eventPromises)
                for (let events of eventPromises)
                    eventBatches = [...eventBatches, ...events];

                let lpInfoPromises = [];
                for (let swapPair of swapPairsToRefresh)
                    lpInfoPromises.push(swapPair.getLiquidityPools());

                // TODO: посмотреть вариант с Promise.allSettled
                lpInfoPromises = await Promise.all(lpInfoPromises);
                for (let lpInfo of lpInfoPromises)
                    lpInfoBatches = [...lpInfoBatches, lpInfo];
            }
        }

        if (this.rootSwapPairContract) {
            rootSwapPairEvents = await this.rootSwapPairContract.getLatestEvents();
        }

        return {
            events: eventBatches,
            lpInfo: lpInfoBatches,
            rootSwapPairEvents: rootSwapPairEvents
        }
    }
}

module.exports = eventListener;