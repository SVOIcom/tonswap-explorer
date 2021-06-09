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
            address: { type: this.CustomTypes.TON_ADDRESS },
            smart_contract_type: { type: this.CustomTypes.ID }
        }
    }

    static get _tableOptions() {
        return {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
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
     * Get record by address
     * @param {String} scAddress 
     */
    static async getRecordByAddress(scAddress) {
        return SmartContractAddresses.findOne({ where: { address: scAddress } });
    }
}



module.exports = SmartContractAddresses;