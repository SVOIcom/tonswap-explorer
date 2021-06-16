/**
 * Pair controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const utils = require("../modules/utils/utils");

const _App = require('./_App');
const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');
const SwapPairEvents = require('../models/SwapPairEvents');
const SwapPairInformation = require('../models/SwapPairInformation');

const models = require('../models');


class Pair extends _App {

    async index(page = 0) {
        try {
            await this.tset('topPairs', await DataFrontendAdapter.getPairsList(page, 50));
            await this.tset('page', page);
        } catch (e) {
            console.log(e);
        }
        return await this.render();
    }

    async pair(pairAddress, page=0) {
        console.log(pairAddress);
        try {
            const chartsData = await models.SwapEvents.getRecentDataGroupedByDay(pairAddress);
            const frontendData = {pairAddress};

            const events = await SwapPairEvents.getPageOfSwapPairEventsBySwapPairAddress(pairAddress, page, 50);
            const tokens = await SwapPairInformation.getSwapPairTokens(pairAddress);
            const pair = await SwapPairInformation.getRecordByAddress(pairAddress);
            pair.swap_pair_name = pair.swap_pair_name.replace('<->','-');

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

            //console.log(events);

            await this.tset('shortPairAddress', utils.shortenPubkey(pairAddress));
            await this.tset('pairAddress', pairAddress);
            await this.tset('events', events);
            await this.tset('chartsData', JSON.stringify(chartsData));
            await this.tset('frontendData', JSON.stringify(frontendData));
            await this.tset('pair', pair);
            console.log(pair);
            await this.tset('page', page);
            return await this.render();
        }catch (e) {
            return '';
        }
    }


}

module.exports = Pair;