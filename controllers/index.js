/*_______ ____  _   _  _____
 |__   __/ __ \| \ | |/ ____|
    | | | |  | |  \| | (_____      ____ _ _ __
    | | | |  | | . ` |\___ \ \ /\ / / _` | '_ \
    | | | |__| | |\  |____) \ V  V / (_| | |_) |
    |_|  \____/|_| \_|_____/ \_/\_/ \__,_| .__/
                                         | |
                                         |_| */
/**
 * @name TONSwap project - tonswap.com
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 */
const _App = require('./_App');

const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');

const SwapPairInformation = require('../models/SwapPairInformation');

const cache = require('../modules/MemoryCache');

class Index extends _App {

    async index() {

        const topPairs = await cache.load('topPair', async () => {
            return [
                ...await DataFrontendAdapter.getPairsList(0, 10),
            ]
        }, 300000);
        await this.tset('topPairs', topPairs);


        const topTokens = await cache.load('topTokens', async () => {
            return [...await DataFrontendAdapter.getTokensList(0, 10),
            ]
        }, 300000);
        await this.tset('topTokens', topTokens);


        const chartsTrCount = await cache.load('chartsTrCount', async () => {
            return await DataFrontendAdapter.getEventsCountGroupedByDay() || {};
        }, 300000);
        await this.tset('chartsTrCount', JSON.stringify(chartsTrCount));

        return await this.render();
    }


    async config() {
        return {};
    }

    async search(query) {
        return await SwapPairInformation.searchPairOrTokens(query, 0, 100);
    }
}

module.exports = Index;