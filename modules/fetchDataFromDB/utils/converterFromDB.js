function convertLPInfoFromDB(lpInfo) {
    return {
        firstLiquidityPool: lpInfo.liquidity_pool_1,
        secondLiquidityPool: lpInfo.liquidity_pool_2,
        lpTokens: lpInfo.lp_tokens_amount,
        timestamp: lpInfo.timestamp
    }
}

function convertSwapPairEvent(swapPairEvent) {
    return {
        tx_id: swapPairEvent.tx_id,
        eventType: swapPairEvent.eventType,
        timestamp: swapPairEvent.timestamp
    }
}

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

function convertSwapEventsFromDB(swapEvent) {
    return {
        tx_id: swapEvent.tx_id,
        providedTokenRoot: swapEvent.provided_token_root,
        targetTokenRoot: swapEvent.provided_token_root,
        tokensUsedForSwap: swapEvent.tokens_used_for_swap,
        tokensReceived: swapEvent.tokens_received,
        fee: swapEvent.fee,
        timestamp: swapEvent.timestamp
    }
}

function convertProvideLiquidityEventsFromDB(provideLiquidityEvent) {
    return {
        tx_id: provideLiquidityEvent.tx_id,
        firstTokenAmount: provideLiquidityEvent.first_token_amount,
        secondTokenAmount: provideLiquidityEvent.second_token_amount,
        lpTokensMinted: provideLiquidityEvent.lp_tokens_minted,
        timestamp: provideLiquidityEvent.timestamp
    }
}

function convertWithdrawLiquidityEventsFromDB(withdrawLiqudityEvent) {
    return {
        tx_id: withdrawLiqudityEvent.tx_id,
        firstTokenAmount: withdrawLiqudityEvent.first_token_amount,
        secondTokenAmount: withdrawLiqudityEvent.second_token_amount,
        lpTokensBurnt: withdrawLiqudityEvent.lp_tokens_burnt,
        timestamp: withdrawLiqudityEvent.timestamp
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