const { convertLPInfoFromDB } = require('../modules/fetchDataFromDB/utils/converterFromDB');
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
            swap_pair_id: { type: this.CustomTypes.ID },
            liquidity_pool_1: { type: this.CustomTypes.NUMBER },
            liquidity_pool_2: { type: this.CustomTypes.NUMBER },
            lp_tokens_amount: { type: this.CustomTypes.NUMBER },
            timestamp: { type: this.CustomTypes.TIMESTAMP }
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