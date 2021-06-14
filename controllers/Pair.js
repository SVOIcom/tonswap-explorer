/**
 * Pair controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const utils = require("../modules/utils/utils");

const _App = require('./_App');


class Pair extends _App {


    async pair(pairAddress) {

        const frontendData = {pairAddress};

        await this.tset('shortPairAddress', utils.shortenPubkey(pairAddress));
        await this.tset('pairAddress', pairAddress);
        await this.tset('frontendData', JSON.stringify(frontendData));
        return await this.render();
    }


}

module.exports = Pair;