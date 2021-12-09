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
const utils = require("../modules/utils/utils");

const _App = require('./_App');
const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');
const SwapPairEvents = require('../models/SwapPairEvents');
const SwapPairInformation = require('../models/SwapPairInformation');
const SwapPairPools = require('../models/SwapPairLiquidityPools');

const models = require('../models');


const cache = require('../modules/MemoryCache');


class Pair extends _App {

    async index(page = 0) {
        try {
            const topPairs = await cache.load('topPair' + page, async () => {
                return [
                    ...await DataFrontendAdapter.getPairsListWith24hVolumes(page, 50),
                ]
                // const topPairs = await cache.load('topPair' + page, async () => {
                //     let pairs = await DataFrontendAdapter.getPairsList(page, 50);
                //     for (let key in pairs) {
                //         pairs[key].volumes24h = await DataFrontendAdapter.getPairRecentDaysComparsion(pairs[key].address);
                //     }
                //     return pairs;
            }, 300000);

            await this.tset('topPairs', topPairs);
            await this.tset('page', page);
        } catch (e) {
            console.log(e);
        }
        return await this.render();
    }

    async all() {
        const allPairs = await cache.load('alPairs', async () => {
            return [
                ...await DataFrontendAdapter.getPairsListWith24hVolumes(0, 5000),
            ]
        }, 300000);
        if(this.req.query.json && this.req.query.json === 'true') {
            return allPairs;
        }

    }

    async pair(pairAddress, page = 0) {
        // console.log(pairAddress);
        // try {
        const frontendData = {pairAddress};

        const events = await SwapPairEvents.getPageOfSwapPairEventsBySwapPairAddress(pairAddress, page, 50);
        const tokens = await SwapPairInformation.getSwapPairTokens(pairAddress);
        const pair = await SwapPairInformation.getRecordByAddress(pairAddress);
        pair.swap_pair_name = pair.swap_pair_name.replace('<->', '-');

        tokens.token1Info = await (await DataFrontendAdapter.getTokensListObject()).getTokenByRootAddress(tokens.token1);
        tokens.token2Info = await (await DataFrontendAdapter.getTokensListObject()).getTokenByRootAddress(tokens.token2);

        //console.log(tokens); process.exit();
        for (let eventKey in events) {
            switch (events[eventKey].eventName) {
                case "Swap":
                    events[eventKey].token1Info = await (await DataFrontendAdapter.getTokensListObject()).getTokenByRootAddress(events[eventKey].providedTokenRoot)
                    events[eventKey].token2Info = await (await DataFrontendAdapter.getTokensListObject()).getTokenByRootAddress(events[eventKey].targetTokenRoot)
                    break;
                default:
                    events[eventKey].token1Info = await (await DataFrontendAdapter.getTokensListObject()).getTokenByRootAddress(tokens.token1)
                    events[eventKey].token2Info = await (await DataFrontendAdapter.getTokensListObject()).getTokenByRootAddress(tokens.token2)

            }
        }

        const volumes24h = await DataFrontendAdapter.getPairRecentDaysComparsion(pairAddress);
        const chartsVolumes = await DataFrontendAdapter.getPairRecentDaysVolumes(pairAddress, 30);

        const pools = await SwapPairPools.getActualInfoByAddress(pairAddress) || {};
        const tokensNames = [tokens.token1Info.symbol, tokens.token2Info.symbol];

        //console.log(events);

        await this.tset('shortPairAddress', utils.shortenPubkey(pairAddress));
        await this.tset('pairAddress', pairAddress);
        await this.tset('events', events);

        await this.tset('volumes24h', volumes24h);
        await this.tset('pools', pools);
        await this.tset('tokensNames', tokensNames);

        await this.tset('tokens', tokens);

        await this.tset('chartsVolumes', JSON.stringify(chartsVolumes));
        await this.tset('frontendData', JSON.stringify(frontendData));
        await this.tset('pair', pair);
        // console.log(pair);
        await this.tset('page', page);

        if(this.req.query.json && this.req.query.json === 'true') {
            return {
                pairAddress,
                events,
                tokens,
                pair,
                volumes24h,
                chartsVolumes,
                pools,
                tokensNames,
            }
        }

        return await this.render();
        /*} catch (e) {
            return '';
        }*/
    }


}

module.exports = Pair;