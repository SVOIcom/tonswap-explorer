const ModelTemplate = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class ProvideLiquidityEvents extends ModelTemplate {
    static get _tableName() {
        return 'provide_liquidity_events';
    }

    static get _tableFields() {
        let numbersType = this.CustomTypes.NUMBER;
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            tx_id: {
                type: this.CustomTypes.TON_TX,
                unique: true
            },
            swap_pair_id:        { type: this.CustomTypes.ID },
            first_token_amount:  { type: numbersType },
            second_token_amount: { type: numbersType },
            lp_tokens_minted:    { type: numbersType },
            timestamp:           { type: this.CustomTypes.TIMESTAMP }
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


    static async getRecordByTxId(txId) {
        return ProvideLiquidityEvents.findOne({ where: { tx_id: txId } });
    }


    static async safeAddLiquidityProvidingEvent(information) {
        let recordExists = await ProvideLiquidityEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await ProvideLiquidityEvents.create({
                ...information
            });
        }
    }
}



module.exports = ProvideLiquidityEvents;