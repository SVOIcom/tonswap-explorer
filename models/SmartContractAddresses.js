const ModelTemplate = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class SmartContractAddresses extends ModelTemplate {
    static get _tableName() {
        return 'smart_contract_addresses';
    }

    static get _tableFields() {
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            swap_pair_id: { type: this.CustomTypes.ID },
            tx_id:        { type: this.CustomTypes.TON_TX, unique: true },
            event_type:   { type: this.CustomTypes.ID },
            timestamp:    { type: this.CustomTypes.TIMESTAMP }
        }
    }

    static get _tableOptions() {
        return {
            timestamps: false,
            freezeTableName: true
        }
    }

    /**
     * @param {String} address 
     * @param { {address: String, smart_contract_type: Number} } information
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



module.exports = SmartContractAddresses;