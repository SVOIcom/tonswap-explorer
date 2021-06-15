/**
 * Pair controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const utils = require("../modules/utils/utils");

const _App = require('./_App');
const DataFrontendAdapter = require('../modules/tools/DataFrontendAdapter');

class Pair extends _App {

    async index(page = 0){
        try {
            await this.tset('topPairs', await DataFrontendAdapter.getPairsList(page, 50));
            await this.tset('page', page);
        }catch (e) {
            console.log(e);
        }
        return await this.render();
    }

    async pair(pairAddress) {

        const frontendData = {pairAddress};

        await this.tset('shortPairAddress', utils.shortenPubkey(pairAddress));
        await this.tset('pairAddress', pairAddress);
        await this.tset('frontendData', JSON.stringify(frontendData));
        return await this.render();
    }


}

module.exports = Pair;