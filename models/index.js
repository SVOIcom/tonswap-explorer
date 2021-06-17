const SmartContractAddresses  = require('./SmartContractAddresses');
const SwapPairInformation     = require('./SwapPairInformation');
const SwapPairEvents          = require('./SwapPairEvents');
const SwapPairLiquidityPools  = require('./SwapPairLiquidityPools');
const SwapEvents              = require('./SwapEvents');
const ProvideLiquidityEvents  = require('./ProvideLiquidityEvents');
const WithdrawLiquidityEvents = require('./WithdrawLiquidityEvents');
const KeyValue = require('./KeyValue');
const ExpiredKeyValue = require('./ExpiredKeyValue');

const _Model = require('./_Model');

/**
 * @type {Record<String, _Model>}
 */
module.exports = {
    SmartContractAddresses,
    SwapPairInformation,
    SwapPairEvents,
    SwapPairLiquidityPools,
    SwapEvents,
    ProvideLiquidityEvents, 
    WithdrawLiquidityEvents,
    KeyValue,
    ExpiredKeyValue,
}