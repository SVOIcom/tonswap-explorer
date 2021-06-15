/**
 * Pair controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const utils = require("../modules/utils/utils");

const _App = require('./_App');
const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');

class Token extends _App {

    async index(page = 0){

            await this.tset('topTokens', await DataFrontendAdapter.getTokensList(page, 50))
            await this.tset('page', page);

        return await this.render();
    }

    async token(tokenRootAddress) {

        let tokensList = await DataFrontendAdapter.getTokensListObject();

        let tokenInfo = await tokensList.getTokenByRootAddress(tokenRootAddress);

        const frontendData = {tokenRootAddress,...tokenInfo};

        await this.tset('tokenInfo', tokenInfo);
        await this.tset('tokenRootAddress', tokenRootAddress);
        await this.tset('frontendData', JSON.stringify(frontendData));
        return await this.render();
    }


}

module.exports = Token;