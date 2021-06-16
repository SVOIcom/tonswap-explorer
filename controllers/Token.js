/**
 * Pair controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const utils = require("../modules/utils/utils");

const _App = require('./_App');
const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');
const SwapPairInformation = require('../models/SwapPairInformation');

class Token extends _App {

    async index(page = 0) {

        await this.tset('topTokens', await DataFrontendAdapter.getTokensList(page, 50))
        await this.tset('page', page);

        return await this.render();
    }

    async token(tokenRootAddress, page = 0) {

        let tokensList = await DataFrontendAdapter.getTokensListObject();

        let tokenInfo = await tokensList.getTokenByRootAddress(tokenRootAddress);

        let tokenSwapPairs = await SwapPairInformation.getSwapPairsByTokenRoot(tokenRootAddress, page * 50, 50);

        for (let pairKey in tokenSwapPairs) {
            tokenSwapPairs[pairKey].swap_pair_name = tokenSwapPairs[pairKey].swap_pair_name.replace('<->', '-');
        }

        const frontendData = {tokenRootAddress, ...tokenInfo};

        await this.tset('tokenInfo', tokenInfo);
        await this.tset('tokenSwapPairs', tokenSwapPairs);
        await this.tset('tokenRootAddress', tokenRootAddress);
        await this.tset('frontendData', JSON.stringify(frontendData));
        await this.tset('page', page);
        return await this.render();
    }


}

module.exports = Token;