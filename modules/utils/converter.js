/**
 * @typedef SwapPairInfo
 * @type {Object}
 * 
 * @property {String} rootContract
 * @property {String} tokenRoot1
 * @property {String} tokenRoot2
 * @property {String} lpTokenRoot
 * @property {String} tokenWallet1
 * @property {String} tokenWallet2
 * @property {String} lpTokenWallet
 * @property {BigInt} deployTimestamp
 * @property {String} swapPairAddress
 * @property {BigInt} uniqueId
 * @property {Number} swapPairCodeVersion
 * @property {String} swapPairLPTokenName
 */

/**
 * @typedef SwapEventInfo
 * @type {Object}
 * 
 * @property {String} providedTokenRoot
 * @property {String} targetTokenRoot
 * @property {BigInt} tokensUsedForSwap
 * @property {BigInt} tokensReceived
 * @property {BigInt} fee
 */

/**
 * @typedef ProvideLiquidityEventInfo
 * @type {Object}
 * 
 * @property {BigInt} liquidityTokensAmount
 * @property {BigInt} firstTokenAmount
 * @property {BigInt} secondTokenAmount
 */

/**
 * @typedef WithdrawLiquidityEventInfo
 * @type {Object}
 * 
 * @property {BigInt} liquidityTokensAmount
 * @property {BigInt} firstTokenAmount
 * @property {BigInt} secondTokenAmount
 */

/**
 * @typedef LiquidityPoolsInfo
 * @type {Object}
 * 
 * @property {BigInt} lp1
 * @property {BigInt} lp2
 * @property {BigInt} lpTokensMinted
 */

/**
 * @typedef GraphQLQueryResult
 * @type {Object}
 * 
 * @property {String} id
 * @property {String} body
 * @property {Number} created_at
 */

/**
 * 
 * @param {SwapPairInfo} spi 
 */
function swapPairInfoToDB(spi) {
    return {
        id: 0,
        swap_pair_address: spi.swapPairAddress,
        root_address: spi.rootContract,
        token1_address: spi.tokenRoot1,
        token2_address: spi.tokenRoot2,
        lptoken_address: spi.lptoken_address,
        wallet1_address: spi.tokenWallet1,
        wallet2_address: spi.tokenWallet2,
        lptoken_wallet_address: spi.lpTokenWallet,
        swap_pair_name: spi.swapPairLPTokenName
    }
}

/**
 * 
 * @param {LiquidityPoolsInfo} lpi 
 * @param {GraphQLQueryResult} queryResult
 */
function liquidityPoolsInfoToDB(lpi, queryResult) {
    return {
        id: 0,
        swap_pair_id: 0,
        liquidity_pool_1: Number(lpi.lp1),
        liquidity_pool_2: Number(lpi.lp2),
        lp_tokens_amount: Number(lpi.lpTokensMinted),
        timestamp: queryResult.created_at
    }
}

/**
 * 
 * @param {SwapEventInfo} si 
 * @param {GraphQLQueryResult} queryResult
 * @param {Number} swapPairId
 * @returns 
 */
function swapEventInfoToDB(si, queryResult, swapPairId) {
    return {
        id: 0,
        tx_id: queryResult.id,
        swap_pair_id: swapPairId,
        provided_token_root: si.providedTokenRoot,
        target_token_root: si.targetTokenRoot,
        tokens_used_for_swap: si.tokensUsedForSwap,
        tokens_received: si.tokensReceived,
        fee: si.fee,
        timestamp: queryResult.created_at
    }
}

/**
 * 
 * @param {ProvideLiquidityEventInfo} pli 
 * @param {GraphQLQueryResult} queryResult 
 * @param {Number} swapPairId 
 * @returns 
 */
function provideLiquidityInfoToDB(pli, queryResult, swapPairId) {
    return {
        id: 0,
        tx_id: queryResult.id,
        swap_pair_id: swapPairId,
        first_token_amount: pli.firstTokenAmount,
        second_token_amount: pli.secondTokenAmount,
        lp_tokens_minted: pli.liquidityTokensAmount,
        timestamp: queryResult.created_at
    }
}

/**
 * 
 * @param {WithdrawLiquidityEventInfo} wli 
 * @param {GraphQLQueryResult} queryResult 
 * @param {Number} swapPairId 
 */
function withdrawLiquidityInfotoDB(wli, queryResult, swapPairId) {
    return {
        id: 0,
        tx_id: queryResult.id,
        swap_pair_id: swapPairId,
        first_token_amount: wli.firstTokenAmount,
        second_token_amount: wli.secondTokenAmount,
        lp_tokens_burnt: wli.liquidityTokensAmount,
        timestamp: queryResult.created_at
    }
}

const converter = {
    swapPairInfoToDB: swapPairInfoToDB,
    liquidityPoolsInfoToDB: liquidityPoolsInfoToDB,
    swapEventInfoToDB: swapEventInfoToDB,
    provideLiquidityInfoToDB: provideLiquidityInfoToDB,
    withdrawLiquidityInfotoDB: withdrawLiquidityInfotoDB,
}

module.exports = converter;