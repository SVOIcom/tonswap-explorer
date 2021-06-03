const { Model, DataTypes } = require('sequelize');

class SmartContractAddresses extends Model {}
class SwapPairInformation extends Model {}
class SwapPairEvents extends Model {}
class SwapPairLiquidityPools extends Model {}
class SwapEvents extends Model {}
class ProvideLiquidityEvents extends Model {}
class WithdrawLiquidityEvents extends Model {}

const addressType = DataTypes.STRING(66);
const txType = DataTypes.STRING(64);
const idType = DataTypes.INTEGER(10);
const timestampType = DataTypes.BIGINT(20);
const numbersType = DataTypes.DOUBLE();

// TODO: add function to add element to database

module.exports = (sequelize) => {
    SmartContractAddresses.init({
        id: { type: idType, primaryKey: true },
        address: { type: addressType },
        smart_contract_type: { type: idType }
    }, {
        sequelize,
        modelName: 'smart_contract_addresses',
        timestamps: false
    });

    SwapPairInformation.init({
        id: { type: idType, primaryKey: true },
        swap_pair_address: { type: addressType },
        root_address: { type: addressType },
        token1_address: { type: addressType },
        token2_address: { type: addressType },
        lptoken_address: { type: addressType },
        wallet1_address: { type: addressType },
        wallet2_address: { type: addressType },
        lptoken_wallet_address: { type: addressType },
        swap_pair_name: { type: DataTypes.STRING(200) }
    }, {
        sequelize,
        modelName: 'swap_pair_information'
    });

    SwapPairEvents.init({
        id: { type: idType, primaryKey: true },
        swap_pair_id: { type: idType },
        tx_id: { type: txType },
        event_type: { type: idType },
        timestamp: { type: timestampType }
    }, {
        sequelize,
        modelName: 'swap_pair_events'
    });

    SwapPairLiquidityPools.init({
        id: { type: idType, primaryKey: true },
        swap_pair_id: { type: idType },
        liquidity_pool_1: { type: numbersType },
        liquidity_pool_2: { type: numbersType },
        lp_tokens_amount: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize,
        modelName: 'swap_pair_liquidity_pools'
    });

    SwapEvents.init({
        id: { type: idType, primaryKey: true },
        tx_id: { type: txType },
        swap_pair_id: { type: idType },
        provided_token_root: { type: addressType },
        target_token_root: { type: addressType },
        tokens_used_for_swap: { type: numbersType },
        tokens_received: { type: numbersType },
        fee: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize,
        modelName: 'swap_events'
    });

    ProvideLiquidityEvents.init({
        id: { type: idType, primaryKey: true },
        tx_id: { type: txType },
        swap_pair_id: { type: idType },
        first_token_amount: { type: numbersType },
        second_token_amount: { type: numbersType },
        lp_tokens_minted: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize,
        modelName: 'provide_liquidity_events'
    });

    WithdrawLiquidityEvents.init({
        id: { type: idType, primaryKey: true },
        tx_id: { type: txType },
        swap_pair_id: { type: idType },
        first_token_amount: { type: numbersType },
        second_token_amount: { type: numbersType },
        lp_tokens_burnt: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize,
        modelName: 'withdraw_liquidity_events'
    });

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