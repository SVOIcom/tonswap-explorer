const refreshSettings = require("../../config/refreshSettings");
const { swapPairs } = require("../../config/smart-contract-addresses");
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
     * @returns {Promise<{events: Array<import("../smart-contract-wrapper/contract").EventType>, lpInfo: Array<Object>}>}
     */
    requestStateRefresh: async function() {
        let eventBatches = [];
        let lpInfoBatches = [];
        let rootSwapPairEvents = [];

        if (swapPairs.length > 0) {
            for (let batchIndex = 0; batchIndex < Math.ceil(swapPairs.length / refreshSettings.swapPairsPerBatch); batchIndex++) {
                /**
                 * @type {Array<SwapPairContract>}
                 */
                let swapPairsToRefresh = swapPairs.slice(
                    batchIndex * refreshSettings.swapPairsPerBatch,
                    (batchIndex + 1) * refreshSettings.swapPairsPerBatch
                );

                eventBatches.concat(
                    await Promise.all(swapPairsToRefresh.map((element) => { return element.getLatestEvents() }))
                );

                lpInfoBatches.concat(
                    await Promise.all(swapPairsToRefresh.map((element) => { return element.getLiquidityPools() }))
                );
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