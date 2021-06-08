const models = require('../../../../models');


const SmartContractAddresses  = models.SmartContractAddresses;
const SwapPairInformation     = models.SwapPairInformation;
const SwapPairEvents          = models.SwapPairEvents;
const SwapPairLiquidityPools  = models.SwapPairLiquidityPools;
const SwapEvents              = models.SwapEvents;
const ProvideLiquidityEvents  = models.ProvideLiquidityEvents;
const WithdrawLiquidityEvents = models.WithdrawLiquidityEvents;


// TODO: add function to add element to database

module.exports = function(sequelizeInstance) {
    return {
        SmartContractAddresses,
        SwapPairInformation,
        SwapPairEvents,
        SwapPairLiquidityPools,
        SwapEvents,
        ProvideLiquidityEvents,
        WithdrawLiquidityEvents
    }
}