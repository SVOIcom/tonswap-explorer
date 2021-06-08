const { Model, DataTypes } = require('sequelize');

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
        let recordExists = await SwapPairInformation.getRecordByAddress(swapPairAddress);
        if (!recordExists) {
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
        let recordExists = await SwapPairEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await SwapPairEvents.create({
                ...information
            });
        }
    }

    static async getRecordByTxId(txId) {
        return SwapPairEvents.findOne({ where: { tx_id: txId } });
    }

    static async getMaxIndex() {
        return SwapPairEvents.max('id');
    }
}

class SwapPairLiquidityPools extends Model {
    static async safeAddLiquidityPoolRecord(information) {
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
        let recordExists = await SwapEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await SwapEvents.create({
                ...information
            });
        }
    }

    static async getRecordByTxId(txId) {
        return SwapEvents.findOne({ where: { tx_id: txId } });
    }

    static async getMaxIndex() {
        return SwapEvents.max('id');
    }
}

class ProvideLiquidityEvents extends Model {
    static async safeAddLiquidityProvidingEvent(information) {
        let recordExists = await ProvideLiquidityEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await ProvideLiquidityEvents.create({
                ...information
            });
        }
    }

    static async getRecordByTxId(txId) {
        return ProvideLiquidityEvents.findOne({ where: { tx_id: txId } });
    }

    static async getMaxIndex() {
        return ProvideLiquidityEvents.max('id');
    }
}

class WithdrawLiquidityEvents extends Model {
    static async safeAddWithdrawLiquidityEvent(information) {
        let recordExists = await WithdrawLiquidityEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await WithdrawLiquidityEvents.create({
                ...information
            });
        }
    }

    static async getRecordByTxId(txId) {
        return WithdrawLiquidityEvents.findOne({ where: { tx_id: txId } });
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

module.exports = function(sequelizeInstance) {
    SmartContractAddresses.init({
        id: { type: idType, primaryKey: true, autoIncrement: true },
        address: { type: addressType },
        smart_contract_type: { type: idType }
    }, {
        sequelize: sequelizeInstance,
        modelName: 'smart_contract_addresses',
        timestamps: false,
        freezeTableName: true
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
        sequelize: sequelizeInstance,
        modelName: 'swap_pair_information',
        timestamps: false,
        freezeTableName: true
    });

    SwapPairEvents.init({
        id: { type: idType, primaryKey: true, autoIncrement: true },
        swap_pair_id: { type: idType },
        tx_id: { type: txType, unique: true },
        event_type: { type: idType },
        timestamp: { type: timestampType }
    }, {
        sequelize: sequelizeInstance,
        modelName: 'swap_pair_events',
        timestamps: false,
        freezeTableName: true
    });

    SwapPairLiquidityPools.init({
        id: { type: idType, primaryKey: true, autoIncrement: true },
        swap_pair_id: { type: idType },
        liquidity_pool_1: { type: numbersType },
        liquidity_pool_2: { type: numbersType },
        lp_tokens_amount: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize: sequelizeInstance,
        modelName: 'swap_pair_liquidity_pools',
        timestamps: false,
        freezeTableName: true
    });

    SwapEvents.init({
        id: { type: idType, primaryKey: true, autoIncrement: true },
        tx_id: { type: txType, unique: true },
        swap_pair_id: { type: idType },
        provided_token_root: { type: addressType },
        target_token_root: { type: addressType },
        tokens_used_for_swap: { type: numbersType },
        tokens_received: { type: numbersType },
        fee: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize: sequelizeInstance,
        modelName: 'swap_events',
        timestamps: false,
        freezeTableName: true
    });

    ProvideLiquidityEvents.init({
        id: { type: idType, primaryKey: true, autoIncrement: true },
        tx_id: { type: txType, unique: true },
        swap_pair_id: { type: idType },
        first_token_amount: { type: numbersType },
        second_token_amount: { type: numbersType },
        lp_tokens_minted: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize: sequelizeInstance,
        modelName: 'provide_liquidity_events',
        timestamps: false,
        freezeTableName: true
    });

    WithdrawLiquidityEvents.init({
        id: { type: idType, primaryKey: true, autoIncrement: true },
        tx_id: { type: txType, unique: true },
        swap_pair_id: { type: idType },
        first_token_amount: { type: numbersType },
        second_token_amount: { type: numbersType },
        lp_tokens_burnt: { type: numbersType },
        timestamp: { type: timestampType }
    }, {
        sequelize: sequelizeInstance,
        modelName: 'withdraw_liquidity_events',
        timestamps: false,
        freezeTableName: true
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