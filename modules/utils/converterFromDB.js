/**
 * @typedef LPInformationDB
 * @type {Object}
 * 
 * @property {Number} id
 * @property {Number} swap_pair_id
 * @property {Number} liquidity_pool_1
 * @property {Number} liquidity_pool_2
 * @property {Number} lp_tokens_amount
 * @property {Number} timestamp
 */

/**
 * @typedef LPInformation
 * @type {Object}
 * 
 * @property {Number} firstLiquidityPool
 * @property {Number} secondLiquidityPool
 * @property {Number} lpTokens
 * @property {Number} timestamp
 */

/**
 * 
 * @param {LPInformationDB} lpInfo 
 * @returns {LPInformation}
 */
function convertLPInfoFromDB(lpInfo) {
    return {
        firstLiquidityPool: lpInfo.liquidity_pool_1,
        secondLiquidityPool: lpInfo.liquidity_pool_2,
        lpTokens: lpInfo.lp_tokens_amount,
        timestamp: lpInfo.timestamp
    }
}

/**
 * @typedef SPEventInformationDB
 * @type {Object}
 * 
 * @property {Number} id
 * @property {Number} swap_pair_id
 * @property {String} tx_id
 * @property {Number} event_type
 * @property {Number} timestamp
 */

/**
 * @typedef SPEventInformation
 * @type {Object}
 * 
 * @property {String} tx_id
 * @property {Number} eventType
 * @property {Number} timestamp
 */

/**
 * 
 * @param {SPEventInformationDB} swapPairEvent 
 * @returns {SPEventInformation}
 */
function convertSwapPairEvent(swapPairEvent) {
    return {
        tx_id: swapPairEvent.tx_id,
        eventType: swapPairEvent.event_type,
        timestamp: swapPairEvent.timestamp
    }
}

/**
 * @typedef SwapPairInformationDB
 * @type {Object}
 * 
 * @property {Number} id
 * @property {String} swap_pair_address
 * @property {String} root_address
 * @property {String} token1_address
 * @property {String} token2_address
 * @property {String} lptoken_address
 * @property {String} wallet1_address
 * @property {String} wallet2_address
 * @property {String} lptoken_wallet_address
 * @property {String} swap_pair_name
 */

/**
 * @typedef SwapPairInformation
 * @type {Object}
 * 
 * @property {Number} swapPairId
 * @property {String} swapPairAddress
 * @property {String} rootAddress
 * @property {String} firstToken
 * @property {String} secondToken
 * @property {String} lpTokenRoot
 * @property {String} firstWallet
 * @property {String} secondWallet
 * @property {String} lpWallet
 * @property {String} swapPairName
 */

/**
 * 
 * @param {SwapPairInformationDB} swapPairInfo 
 * @returns {SwapPairInformation}
 */
function convertSPInfoFromDB(swapPairInfo) {
    return {
        swapPairId: swapPairInfo.id,
        swapPairAddress: swapPairInfo.swap_pair_address,
        rootAddress: swapPairInfo.root_address,
        firstToken: swapPairInfo.token1_address,
        secondToken: swapPairInfo.token2_address,
        lpTokenRoot: swapPairInfo.lptoken_address,
        firstWallet: swapPairInfo.wallet1_address,
        secondWallet: swapPairInfo.wallet2_address,
        lpWallet: swapPairInfo.lptoken_wallet_address,
        swapPairName: swapPairInfo.swap_pair_name
    }
}

/**
 * @typedef SwapEventInformationDB
 * @type {Object}
 * 
 * @property {Number} id
 * @property {String} tx_id
 * @property {String} provided_token_root
 * @property {String} target_token_root
 * @property {Number} tokens_used_for_swap
 * @property {Number} tokens_received
 * @property {Number} fee
 * @property {Number} timestamp
 */

/**
 * @typedef SwapEventInformation
 * @type {Object}
 * 
 * @property {String} tx_id
 * @property {String} providedTokenRoot
 * @property {String} targetTokenRoot
 * @property {Number} tokensUsedForSwap
 * @property {Number} tokensReceived
 * @property {Number} fee
 * @property {Number} timestamp
 * @property {String} eventName
 */

/**
 * 
 * @param {SwapEventInformationDB} swapEvent 
 * @returns {SwapEventInformation}
 */
function convertSwapEventsFromDB(swapEvent) {
    return {
        tx_id: swapEvent.tx_id,
        providedTokenRoot: swapEvent.provided_token_root,
        targetTokenRoot: swapEvent.target_token_root,
        tokensUsedForSwap: swapEvent.tokens_used_for_swap,
        tokensReceived: swapEvent.tokens_received,
        fee: swapEvent.fee,
        timestamp: swapEvent.timestamp,
        eventName: 'Swap'
    }
}

/**
 * @typedef ProvideLiquidityEventInfromationDB
 * @type {Object}
 * 
 * @property {Number} id
 * @property {String} tx_id
 * @property {Number} swap_pair_id
 * @property {Number} first_token_amount
 * @property {Number} second_token_amount
 * @property {Number} lp_tokens_minted
 * @property {Number} timestamp
 */

/**
 * @typedef ProvideLiquidityEventInfromation
 * @type {Object}
 * 
 * @property {String} tx_id
 * @property {Number} firstTokenAmount
 * @property {Number} secondTokenAmount
 * @property {Number} lpTokensMinted
 * @property {Number} timestamp
 * @property {String} eventName
 */

/**
 * 
 * @param {ProvideLiquidityEventInfromationDB} provideLiquidityEvent 
 * @returns {ProvideLiquidityEventInfromation}
 */
function convertProvideLiquidityEventsFromDB(provideLiquidityEvent) {
    return {
        tx_id: provideLiquidityEvent.tx_id,
        firstTokenAmount: provideLiquidityEvent.first_token_amount,
        secondTokenAmount: provideLiquidityEvent.second_token_amount,
        lpTokensMinted: provideLiquidityEvent.lp_tokens_minted,
        timestamp: provideLiquidityEvent.timestamp,
        eventName: 'ProvideLiquidity'
    }
}

/**
 * @typedef WithdrawEventInformationDB
 * @type {Object}
 * 
 * @property {Number} id
 * @property {String} tx_id
 * @property {Number} swap_pair_id
 * @property {Number} first_token_amount
 * @property {Number} second_token_amount
 * @property {Number} lp_tokens_burnt
 * @property {Number} timestamp
 */

/**
 * @typedef WithdrawEventInformation
 * @type {Object}
 * 
 * @property {String} tx_id
 * @property {Number} firstTokenAmount
 * @property {Number} secondTokenAmount
 * @property {Number} lpTokensBurnt
 * @property {Number} timestamp
 * @property {String} eventName
 */

/**
 * 
 * @param {WithdrawEventInformationDB} withdrawLiqudityEvent 
 * @returns {WithdrawEventInformation}
 */
function convertWithdrawLiquidityEventsFromDB(withdrawLiqudityEvent) {
    return {
        tx_id: withdrawLiqudityEvent.tx_id,
        firstTokenAmount: withdrawLiqudityEvent.first_token_amount,
        secondTokenAmount: withdrawLiqudityEvent.second_token_amount,
        lpTokensBurnt: withdrawLiqudityEvent.lp_tokens_burnt,
        timestamp: withdrawLiqudityEvent.timestamp,
        eventName: 'WithdrawLiquidity'
    }
}

module.exports = {
    convertLPInfoFromDB,
    convertSwapPairEvent,
    convertSPInfoFromDB,
    convertSwapEventsFromDB,
    convertProvideLiquidityEventsFromDB,
    convertWithdrawLiquidityEventsFromDB
}