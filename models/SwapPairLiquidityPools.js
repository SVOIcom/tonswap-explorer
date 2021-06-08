const ModelTemplate = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class SwapPairLiquidityPools extends ModelTemplate {
    static get tableName() {
        return 'swap_pair_liquidity_pools';
    }


    static get tableFields() {
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            swap_pair_id: { type: this.CustomTypes.ID },
            liquidity_pool_1: { type: this.CustomTypes.NUMBER },
            liquidity_pool_2: { type: this.CustomTypes.NUMBER },
            lp_tokens_amount: { type: this.CustomTypes.NUMBER },
            timestamp: { type: this.CustomTypes.TIMESTAMP }
        }
    }


    static get tableOptions() {
        return {
            timestamps: false,
            freezeTableName: true
        }
    }


    static async safeAddLiquidityPoolRecord(information) {
        await SwapPairLiquidityPools.create({
            ...information
        });
    }
}



module.exports = SwapPairLiquidityPools;