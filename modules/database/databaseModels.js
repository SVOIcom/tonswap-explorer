const { Model, DataTypes } = require('sequelize');
const { converter } = require('../utils');

/**
 * @typedef SmartContractAddressRecord
 * @type {Object}
 * 
 * @param {String} address
 * @param {Number} smart_contract_type
 */
class SmartContractAddresses extends Model {
    /**
     * 
     * @param {String} address 
     * @param {SmartContractAddressRecord} information 
     */
    static async safeAddByAddress(address, information) {
        let recordExists = await SmartContractAddresses.getRecordByAddress(address) ? true : false;
        if (!recordExists) {
            information.id = await SmartContractAddresses.getMaxIndex() + 1;
            information.id = Number.isNaN(information.id) ? 0 : information.id;
            await SmartContractAddresses.create({
                ...information
            });
        }
    }

    /**
     * Get maximum index of table
     * @returns {Number}
     */
    static async getMaxIndex() {
        return SmartContractAddresses.max('id');
    }

    /**
     * Get record by address
     * @param {String} scAddress 
     */
    static async getRecordByAddress(scAddress) {
        return SmartContractAddresses.findOne({ where: { address: scAddress } });
    }
}

class SwapPairInformation extends Model {
    static async safeAddInformation(swapPairAddress, information) {
        let recordExists = SwapPairInformation.getRecordByAddress(swapPairAddress);
        if (!recordExists) {
            information.id = await SwapPairInformation.getMaxIndex();
            information.id = Number.isNaN(information.id) ? 0 : information.id;
            await SwapPairInformation.create({
                ...information
            });
        }
    }

    /**
     * 
     * @param {String} address 
     */
    static async getRecordByAddress(address) {
        return SwapPairInformation.findOne({ where: { swap_pair_address: address } });
    }

    static async getMaxIndex() {
        return SwapPairInformation.max('id');
    }
}

class SwapPairEvents extends Model {
    static async safeAddEvent(information) {
        information.id = await SwapPairEvents.getMaxIndex() + 1;
        information.id = Number.isNaN(information.id) ? 0 : information.id;
        await SwapPairEvents.create({
            ...information
        });
    }

    static async getMaxIndex() {
        return SwapPairEvents.max('id');
    }
}

class SwapPairLiquidityPools extends Model {
    static async safeAddLiquidityPoolRecord(information) {
        information.id = await SwapPairLiquidityPools.getMaxIndex() + 1;
        information.id = Number.isNaN(information.id) ? 0 : information.id;
        await SwapPairLiquidityPools.create({
            ...information
        });
    }

    static async getMaxIndex() {
        return SwapPairLiquidityPools.max('id');
    }
}

class SwapEvents extends Model {
    static async safeAddSwapEvent(information) {
        information.id = await SwapEvents.getMaxIndex() + 1;
        information.id = Number.isNaN(information.id) ? 0 : information.id;
        await SwapEvents.create({
            ...information
        });
    }

    static async getMaxIndex() {
        return SwapEvents.max('id');
    }
}

class ProvideLiquidityEvents extends Model {
    static async safeAddLiquidityProvidingEvent(information) {
        information.id = await ProvideLiquidityEvents.getMaxIndex() + 1;
        information.id = Number.isNaN(information.id) ? 0 : information.id;
        await ProvideLiquidityEvents.create({
            ...information
        });
    }

    static async getMaxIndex() {
        return ProvideLiquidityEvents.max('id');
    }
}

class WithdrawLiquidityEvents extends Model {
    static async safeAddWithdrawLiquidityEvent(information) {
        information.id = await WithdrawLiquidityEvents.getMaxIndex() + 1;
        information.id = Number.isNaN(information.id) ? 0 : information.id;
        await WithdrawLiquidityEvents.create({
            ...information
        });
    }

    static async getMaxIndex() {
        return WithdrawLiquidityEvents.max('id');
    }
}

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