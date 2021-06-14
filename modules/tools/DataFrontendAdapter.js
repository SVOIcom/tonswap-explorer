const SwapPairsModel = require('../../models/SwapPairInformation');
const TokensList = require('../tonswap/tokenlist/TokensList');

let tokensList = new TokensList()

class DataFrontendAdapter {
    static async getPairsList(page = 0, limit = 100) {
        let pairs = await SwapPairsModel.getPageOfSwapPairs(page, limit);

        if(!tokensList.isLoaded) {
            await tokensList.load();
        }

        let adaptedPairsList = [];

        for (let pair of pairs) {
            adaptedPairsList.push({
                name: pair.swapPairName.replace('<->', '-'),
                tokenRoot1: '',
                tokenRoot2: '',
                tokenIcon1: '/img/exchange/eth.png',
                tokenIcon2: '/img/exchange/eth.png',
                address: pair.swapPairAddress,

            },)

        }

        return adaptedPairsList;
    }

    static async getTokensList(page = 0, limit = 100) {
        let tokens = await SwapPairsModel.getTokens(page, limit);

        if(!tokensList.isLoaded) {
            await tokensList.load();
        }
        console.log(tokens);

        let adaptedTokens = [];

        for (let token of tokens) {
            let tokenInfo = await tokensList.getTokenByRootAddress(token);
            if(!tokenInfo) {
                continue;
            }
           // console.log(tokenInfo);
            adaptedTokens.push({
                tokenRoot: token,
                name: tokenInfo.name,
                ticker: tokenInfo.symbol,
                tokenIcon: tokenInfo.icon,
                decimals: tokenInfo.decimals,
            })
        }

        return adaptedTokens;
    }
}

module.exports = DataFrontendAdapter;