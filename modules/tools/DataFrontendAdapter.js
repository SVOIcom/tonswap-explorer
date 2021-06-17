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

const SwapPairsModel = require('../../models/SwapPairInformation');
const SwapEvents = require('../../models/SwapEvents');
const EventsModel = require('../../models/SwapPairEvents');
const TokensList = require('../tonswap/tokenlist/TokensList');
const Database = require('../database');

let tokensList = new TokensList()

class DataFrontendAdapter {
    static async getPairsList(page = 0, limit = 100) {
        let pairs = await SwapPairsModel.getPageOfSwapPairs(page, limit);

        if(!tokensList.isLoaded) {
            await tokensList.load();
        }

        let adaptedPairsList = [];

        for (let pair of pairs) {
            let leftTokenInfo = await tokensList.getTokenByRootAddress(pair.firstToken);
            let rightTokenInfo = await tokensList.getTokenByRootAddress(pair.secondToken);
            let lpTokenInfo = await tokensList.getTokenByRootAddress(pair.lpTokenRoot);
            //console.log(pair);
            adaptedPairsList.push({
                name: pair.swapPairName.replace('<->', '-'),
                tokenRoot1: pair.firstToken,
                tokenRoot2: pair.secondToken,
                tokenIcon1: leftTokenInfo?.icon,
                tokenIcon2: rightTokenInfo?.icon,
                lpTokenRoot: pair.lpTokenRoot,
                lpTokenIcon: lpTokenInfo?.icon,
                address: pair.swapPairAddress,
                token1Decimals: leftTokenInfo?.decimals||9,
                token2Decimals: rightTokenInfo?.decimals||9,

            },)

        }

        return adaptedPairsList;
    }

    static async getTokenPairsCount(tokenRoot) {
        return await SwapPairsModel.getSwapPairsCountByTokenRoot(tokenRoot);
    }

    static async getTokensList(page = 0, limit = 100) {
        let tokens = await SwapPairsModel.getTokens(page, limit);

        if(!tokensList.isLoaded) {
            await tokensList.load();
        }
        //console.log(tokens);

        let adaptedTokens = [];

        for (let token of tokens) {
            let tokenInfo = await tokensList.getTokenByRootAddress(token);
            let pairsCount = await DataFrontendAdapter.getTokenPairsCount(token);
            let liquidity = await SwapPairsModel.getTokenLiquidity(token);
            if(!tokenInfo) {
                adaptedTokens.push({
                    tokenRoot: token,
                    name: token,
                    ticker: '',
                    tokenIcon: '',
                    decimals: null,
                    pairsCount,
                    liquidity
                })
                continue;
            }
            // console.log(tokenInfo);
            adaptedTokens.push({
                tokenRoot: token,
                name: tokenInfo.name,
                ticker: tokenInfo.symbol,
                tokenIcon: tokenInfo.icon,
                decimals: tokenInfo.decimals,
                pairsCount,
                liquidity
            })
        }

        return adaptedTokens;
    }

    static async getTokensListObject() {
        if(!tokensList.isLoaded) {
            await tokensList.load();
        }
        return tokensList;
    }

    static async getEventsCountGroupedByDay(numOfDays = 30) {
        const data = await EventsModel.getRecentEventsCountGroupedByDay(numOfDays);
        if(data === null) {
            return null;
        }

        return this._calculateEventsCount(data);
    }

    static async getPairRecentDaysVolumes(swapPairAddress, numOfDays = 30) {
        const query = await SwapEvents.getRecentDataGroupedByDay(swapPairAddress, numOfDays);
        if(query === null) {
            return null;
        }

        let volumes = this._calculateSwapsVolumes(query);
        return volumes;
    }


    static async getPairRecentDaysComparsion(swapPairAddress) {
        const data = await SwapEvents.getRecentDaysStats(swapPairAddress);

        if(data === null) {
            return null;
        }

        let volumes = this._calculateSwapsVolumes(data);

        const res = {
            prevDay: volumes['0'] || {volume: 0, count: 0},
            currDay: volumes['1'] || {volume: 0, count: 0}
        }
        res.prevDay.volume = Math.round(res.prevDay.volume);
        res.currDay.volume = Math.round(res.currDay.volume);

        res.volumesChange = ((res.currDay.volume / res.prevDay.volume) - 1) * 100;
        res.transactionsChange = ((res.currDay.count / res.prevDay.count) - 1) * 100;

        if(Number.isFinite(res.volumesChange)) {
            res.volumesChange = (res.volumesChange > 0 ? '+' : '') + res.volumesChange.toFixed(2) + '%';
        } else {
            res.volumesChange = '';
        }

        if(Number.isFinite(res.transactionsChange)) {
            res.transactionsChange = (res.transactionsChange > 0 ? '+' : '') + res.transactionsChange.toFixed(2) + '%';
        } else {
            res.transactionsChange = '';
        }


        return res;
    }


    static _calculateSwapsVolumes(dbQuery) {
        let obj = {};
        for (let el of dbQuery.groupedData) {
            const d = el.date;

            if(!obj[d]) {
                obj[d] = {volume: 0, count: 0}
            }

            if(dbQuery.token1 === el.providedTokenRoot) {
                obj[d].volume += el.swaped;
            } else {
                const rate = (el.received / el.swaped);
                obj[d].volume += el.received + rate * el.fee
            }

            obj[d].count += el.count;
        }

        return obj;
    }


    static _calculateEventsCount(dbQuery) {
        let obj = {};

        for (let el of dbQuery.groupedData) {
            const d = el.date;
            if(!obj[d]) {
                obj[d] = {volume: 0, count: 0}
            }
            obj[d].count += el.count;
        }

        return obj;
    }
}


if(require.main === module) {
    (async () => {
        await Database.init();
        const res = await DataFrontendAdapter.getEventsCountGroupedByDay();
        console.log(res);
    })();
}


module.exports = DataFrontendAdapter;