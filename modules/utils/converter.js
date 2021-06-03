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

const { SWAP_EVENT_ID, WITHDRAW_LIQUIDITY_EVENT_ID, PROVIDE_LIQUIDITY_EVENT_ID, SWAP_EVENT_NAME, WITHDRAW_LIQUIDITY_EVENT_NAME, PROVIDE_LIQUIDITY_EVENT_NAME } = require("./constants");

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
 * @returns
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
 * @param {import("../smart-contract-wrapper/contract").EventType} event
 * @returns
 */
function liquidityPoolsInfoToDB(event) {
    return {
        swap_pair_id: event.swapPairId,
        liquidity_pool_1: Number(event.lpi.lp1),
        liquidity_pool_2: Number(event.lpi.lp2),
        lp_tokens_amount: Number(event.lpi.lpTokensMinted),
        timestamp: event.timestamp
    }
}

/**
 * 
 * @param {import("../smart-contract-wrapper/contract").EventType} event
 * @returns 
 */
function swapPairEventsInfoToDB(event) {
    let event_type = 0;
    if (event.name == SWAP_EVENT_NAME) event_type = SWAP_EVENT_ID;
    if (event.name == WITHDRAW_LIQUIDITY_EVENT_NAME) event_type = WITHDRAW_LIQUIDITY_EVENT_ID;
    if (event.name == PROVIDE_LIQUIDITY_EVENT_NAME) event_type = PROVIDE_LIQUIDITY_EVENT_ID;

    return {
        swap_pair_id: event.swapPairId,
        tx_id: event.txId,
        event_type: event_type,
        timestamp: event.timestamp
    }
}

/**
 * 
 * @param {import("../smart-contract-wrapper/contract").EventType} event
 * @returns 
 */
function swapEventInfoToDB(event) {
    return {
        tx_id: event.txId,
        swap_pair_id: event.swapPairId,
        provided_token_root: event.value.providedTokenRoot,
        target_token_root: event.value.targetTokenRoot,
        tokens_used_for_swap: Number(event.value.tokensUsedForSwap),
        tokens_received: Number(event.value.tokensReceived),
        fee: Number(event.value.fee),
        timestamp: event.timestamp
    }
}

/**
 * 
 * @param {import("../smart-contract-wrapper/contract").EventType} event
 * @returns 
 */
function provideLiquidityInfoToDB(event) {
    return {
        tx_id: event.txId,
        swap_pair_id: event.swapPairId,
        first_token_amount: Number(event.value.firstTokenAmount),
        second_token_amount: Number(event.value.secondTokenAmount),
        lp_tokens_minted: Number(event.value.liquidityTokensAmount),
        timestamp: event.timestamp
    }
}

/**
 * 
 * @param {import("../smart-contract-wrapper/contract").EventType} event
 * @returns
 */
function withdrawLiquidityInfotoDB(event) {
    return {
        tx_id: event.txId,
        swap_pair_id: event.swapPairId,
        first_token_amount: Number(event.value.firstTokenAmount),
        second_token_amount: Number(event.value.secondTokenAmount),
        lp_tokens_burnt: Number(event.value.liquidityTokensAmount),
        timestamp: event.timestamp
    }
}

const converter = {
    swapPairInfoToDB,
    liquidityPoolsInfoToDB,
    swapPairEventsInfoToDB,
    swapEventInfoToDB,
    provideLiquidityInfoToDB,
    withdrawLiquidityInfotoDB,
}

module.exports = converter;