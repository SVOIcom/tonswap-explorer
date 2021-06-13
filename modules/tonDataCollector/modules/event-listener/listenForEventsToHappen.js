const logger = new(require("../../../utils/logger"))();
const { SwapPairContract, RootSwapPairContract } = require("../smart-contract-interaction");
const refreshSettings = require("../../config/refreshSettings");
const { sleep } = require("../utils");

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
            let batchCount = Math.ceil(this.swapPairs.length / refreshSettings.swapPairsPerBatch);
            for (let batchIndex = 0; batchIndex < batchCount; batchIndex++) {
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

                let swapPairsToUpdateState = [];
                // TODO: посмотреть вариант с Promise.allSettled
                try {
                    eventPromises = await Promise.all(eventPromises)
                    for (let batchSwapPairIndex = 0; batchSwapPairIndex < eventPromises.length; batchSwapPairIndex++) {
                        events = eventPromises[batchSwapPairIndex];
                        if (events.length > 0) {
                            swapPairsToUpdateState.push(batchSwapPairIndex);
                            eventBatches = [...eventBatches, ...events];
                        }
                    }
                } catch (err) {
                    logger.error(err);
                }

                let lpInfoPromises = [];
                for (let batchSwapPairIndex of swapPairsToUpdateState)
                    lpInfoPromises.push(swapPairsToRefresh[batchSwapPairIndex].getLiquidityPools());

                // TODO: посмотреть вариант с Promise.allSettled
                try {
                    lpInfoPromises = await Promise.all(lpInfoPromises);
                    for (let lpInfo of lpInfoPromises)
                        lpInfoBatches = [...lpInfoBatches, lpInfo];
                } catch (err) {
                    logger.error(err);
                }

                if (batchCount > 1)
                    await sleep(refreshSettings.refreshTimeout)
            }
        }

        if (this.rootSwapPairContract) {
            try {
                rootSwapPairEvents = await this.rootSwapPairContract.getLatestEvents();
            } catch (err) {
                rootSwapPairEvents = [];
                logger.error(err);
            }
        }

        return {
            events: eventBatches,
            lpInfo: lpInfoBatches,
            rootSwapPairEvents: rootSwapPairEvents
        }
    }
}

module.exports = eventListener;