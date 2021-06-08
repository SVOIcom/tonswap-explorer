const Model = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class SwapPairInformation extends Model {
    static get tableName() {
        return 'swap_pair_information';
    }

    static get tableFields() {
        let addressType = this.CustomTypes.TON_ADDRESS;
        return {
            id: { 
                type: this.CustomTypes.ID, 
                primaryKey: true,
                autoIncrement: true
            },
            swap_pair_address:      { type: addressType },
            root_address:           { type: addressType },
            token1_address:         { type: addressType },
            token2_address:         { type: addressType },
            lptoken_address:        { type: addressType },
            wallet1_address:        { type: addressType },
            wallet2_address:        { type: addressType },
            lptoken_wallet_address: { type: addressType },
            swap_pair_name:         { type: DataTypes.STRING(200) }
        }
    }

    static get tableOptions() {
        return {
            timestamps: false,
            freezeTableName: true
        };
    }


    static async safeAddInformation(swapPairAddress, information) {
        let recordExists = await SwapPairInformation.getRecordByAddress(swapPairAddress);
        if (!recordExists) {
            await SwapPairInformation.create({
                ...information
            });
        }
    }


    /**
     * @param {String} address 
     */
    static async getRecordByAddress(address) {
        return SwapPairInformation.findOne({ where: { swap_pair_address: address } });
    }

    static async getMaxIndex() {
        return SwapPairInformation.max('id');
    }
}



module.exports = SwapPairInformation;