const ModelTemplate = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class SmartContractAddresses extends ModelTemplate {
    static get tableName() {
        return 'swap_pair_events';
    }

    static get tableFields() {
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            address:             { type: this.CustomTypes.TON_ADDRESS },
            smart_contract_type: { type: this.CustomTypes.ID }
        }
    }

    static get tableOptions() {
        return {
            timestamps: false,
            freezeTableName: true
        }
    }


    static async getRecordByTxId(txId) {
        return SwapPairEvents.findOne({ where: { tx_id: txId } });
    }


    static async safeAddEvent(information) {
        let recordExists = await SwapPairEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await SwapPairEvents.create({
                ...information
            });
        }
    }
}



module.exports = SmartContractAddresses;