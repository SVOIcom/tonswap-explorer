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

            },)

        }

        return adaptedPairsList;
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

    static async  getTokensListObject(){
        if(!tokensList.isLoaded) {
            await tokensList.load();
        }
        return tokensList;
    }
}

module.exports = DataFrontendAdapter;