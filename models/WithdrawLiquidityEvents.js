const Model = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class WithdrawLiquidityEvents extends Model {
    static get tableName() {
        return 'withdraw_liquidity_events';
    }

    static get tableFields() {
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
            swap_pair_id:           { type: this.CustomTypes.ID },
            first_token_amount:     { type: numbersType },
            second_token_amount:    { type: numbersType },
            lp_tokens_burnt:        { type: numbersType },
            timestamp:              { type: this.CustomTypes.TIMESTAMP }
        }
    }

    static get tableOptions() {
        return {
            timestamps: false,
            freezeTableName: true
        }
    }


    static async getRecordByTxId(txId) {
        return WithdrawLiquidityEvents.findOne({ where: { tx_id: txId } });
    }

    static async getMaxIndex() {
        return WithdrawLiquidityEvents.max('id');
    }


    static async safeAddWithdrawLiquidityEvent(information) {
        let recordExists = await WithdrawLiquidityEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await WithdrawLiquidityEvents.create({
                ...information
            });
        }
    }
}



module.exports = WithdrawLiquidityEvents;