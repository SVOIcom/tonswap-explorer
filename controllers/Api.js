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

class Api extends _App {



    async tokens() {
        const apiTopTokens = await this.cache.load('apiTokens', async () => {
            return [...await DataFrontendAdapter.getTokensList(0, 1000),
            ]
        }, 300000);
        //return {tokens: apiTopTokens};

        this.res.jsonp(apiTopTokens);

        return;
    }
}

module.exports = Api;