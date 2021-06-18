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
                token1Decimals: leftTokenInfo?.decimals  || 9,
                token2Decimals: rightTokenInfo?.decimals || 9,
            },)
        }

        return adaptedPairsList;
    }


    static async getPairsListWith24hVolumes(page=0, limit=100) {
        const pairs = await this.getPairsList(page, limit);
        const data  = await this.getPairsRecentDaysData(pairs.map(p => p.address));

        for (let p of pairs) {
            if (data[p.address]) {
                p.volumes24h = data[p.address];
            }     
            else {
                p.volumes24h = {
                    currDay: {count: 0, volume: 0},
                    prevDay: {count: 0, volume: 0},
                    volumeChange: 0.0,
                    countChange: 0.0
                }
            }
        }

        return pairs;
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

        let volumes = this._calculateSwapsVolumes(query.groupedData, query.token1);
        return volumes;
    }

    static async getTokenRecentDaysVolumes(tokenAddress, numOfDays=30) {
        const query = await SwapEvents.getRecentDataGroupedByDayByTokenAddress(tokenAddress, numOfDays);
        if(query === null) {
            return null;
        }

        let volumes = this._calculateSwapsVolumes(query.groupedData, query.tokenAddress);
        return volumes;
    }


    static async getPairRecentDaysComparsion(swapPairAddress) {
        const data = await SwapEvents.getRecentDaysStats(swapPairAddress);
        if (data === null) {
            return null;
        }
        let volumes = this._calculateSwapsVolumes(data.groupedData, data.token1);

        return this._convertToChartDaysComparsionData(volumes);
    }

    static async getPairsRecentDaysData(swapPairAddressesList) {
        const data = await SwapEvents.getRecentDaysStatsAllPairs(swapPairAddressesList);

        for(let addr of Object.keys(data)) {
            const volumes = this._calculateSwapsVolumes(data[addr].groupedData, data[addr].token1);
            data[addr] = this._convertToChartDaysComparsionData(volumes);
        }

        return data;
    }

    // getPairsInfo()

    static _convertToChartDaysComparsionData(data) {
        const res = {
            prevDay: data['prev24h']  || {volume: 0, count: 0},
            currDay: data['curr24h'] || {volume: 0, count: 0}
        }
        res.prevDay.volume = Math.round(res.prevDay.volume);
        res.currDay.volume = Math.round(res.currDay.volume);

        res.volumeChange = ((res.currDay.volume / res.prevDay.volume) - 1);
        res.countChange = ((res.currDay.count / res.prevDay.count) - 1);

        return res;
    }

    
    static _calculateSwapsVolumes(groupedData, primaryToken) {
        if (!groupedData || !primaryToken)
            throw Error ('kek')
        let obj = {};
        for (let el of groupedData) {
            const d = el.date;

            if(!obj[d]) {
                obj[d] = {volume: 0, count: 0}
            }

            if(primaryToken === el.providedTokenRoot) {
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
        const res = await DataFrontendAdapter.getPairsRecentDaysComparsion(['0:12987e0102acf7ebfe916da94a1308540b9894b3b99f8d5c7043a39725c08bdf']);
        console.log(res);
    })();
}


module.exports = DataFrontendAdapter;