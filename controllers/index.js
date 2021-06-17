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

const SwapPairsModel = require('../models/SwapPairInformation');
const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');

const SwapPairInformation = require('../models/SwapPairInformation');
const KeyValue = require('../models/KeyValue');

class Index extends _App {

    async index() {

        await this.tset('topPairs', [
            ...await DataFrontendAdapter.getPairsList(),
        ]);

        await KeyValue.set('a', 123321);
        console.log(await KeyValue.get('b', 11111111));


        await this.tset('topTokens', [...await DataFrontendAdapter.getTokensList(),
        ]);

        const chartsTrCount = await DataFrontendAdapter.getEventsCountGroupedByDay() || {};
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