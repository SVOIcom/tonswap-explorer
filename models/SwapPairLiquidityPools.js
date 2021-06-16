const { convertLPInfoFromDB } = require('../modules/utils/converterFromDB');
const SwapPairInformation = require('./SwapPairInformation');
const ModelTemplate = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)


class SwapPairLiquidityPools extends ModelTemplate {
    static get _tableName() {
        return 'swap_pair_liquidity_pools';
    }


    static get _tableFields() {
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            swap_pair_id:     { type: this.CustomTypes.ID },
            liquidity_pool_1: { type: this.CustomTypes.NUMBER },
            liquidity_pool_2: { type: this.CustomTypes.NUMBER },
            lp_tokens_amount: { type: this.CustomTypes.NUMBER },
            timestamp:        { type: this.CustomTypes.TIMESTAMP }
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


    static async safeAddLiquidityPoolRecord(information) {
        await SwapPairLiquidityPools.create({
            ...information
        });
    }


    /**
     * @param {string} swapPairAddress 
     * @returns {  Promise<null> | Promise<{swapPairId: Number, lp1: Number, lp2: Number,  lpTokensAmount: Number, timestamp: Number}>}
     */
    static async getActualInfoByAddress(swapPairAddress) {
        let swapPairId = await SwapPairInformation.findOne({
            where: {swap_pair_address: swapPairAddress},
            attributes: ['id']
        });
        swapPairId = swapPairId?.dataValues?.id
        if (!swapPairId){
            return null;
        }

        const info = await this.findOne({
            where: { swap_pair_id: swapPairId },

            attributes: [
                ['swap_pair_id',      'swapPairId'],
                ['liquidity_pool_1',  'lp1'],
                ['liquidity_pool_2',  'lp2'],
                ['lp_tokens_amount',  'lpTokensAmount'],
                'timestamp'
            ],

            order: [ ['id', 'DESC'] ]
        })

        return info?.dataValues || {swapPairId: swapPairId, lp1: 0, lp2: 0, lpTokensAmount: 0};
    }   


    static async getSwapPairLPInfoById(swapPairId, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairLPInfo = [];
        try {
            swapPairLPInfo = await SwapPairLiquidityPools.findAll({
                where: { swap_pair_id: swapPairId },
                limit: limit,
                offset: offset,
                order: [
                    ['timestamp', 'DESC']
                ]
            });
            swapPairLPInfo = swapPairLPInfo.map((element) => convertLPInfoFromDB(element.dataValues));
        } catch (err) {
            console.log(err);
        }

        return swapPairLPInfo;
    }


    static async getSwapPairLPInfoByAddress(swapPairAddress, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairLPInfo = [];
        let swapPairId = await SwapPairInformation.getSwapPairIdByAddress(swapPairAddress);

        if (swapPairId !== -1) {
            swapPairLPInfo = await this.getSwapPairLPInfoById(swapPairId, offset, limit);
        }

        return swapPairLPInfo;
    }

    static async getSwapPairLPInfoByName(swapPairName, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairLPInfo = [];
        let swapPairId = await SwapPairInformation.getSwapPairIdByName(swapPairName);

        if (swapPairId !== -1) {
            swapPairLPInfo = await this.getSwapPairLPInfoById(swapPairId, offset, limit);
        }

        return swapPairLPInfo;
    }

    static async getPageOfSwapPairLPInfoById(swapPairId, page = 0, pageSize = 100) {
        return await SwapPairLiquidityPools.getSwapPairLPInfoById(swapPairId, page * pageSize, pageSize);
    }

    static async getPageOfSwapPairLPInfoByAddress(swapPairAddress, page = 0, pageSize = 100) {
        return await SwapPairLiquidityPools.getSwapPairLPInfoByAddress(swapPairAddress, page * pageSize, pageSize);
    }

    static async getPageOfSwapPairLPInfoByName(swapPairName, page = 0, pageSize = 100) {
        return await SwapPairLiquidityPools.getSwapPairLPInfoByName(swapPairName, page * pageSize, pageSize);
    }
}



module.exports = SwapPairLiquidityPools;