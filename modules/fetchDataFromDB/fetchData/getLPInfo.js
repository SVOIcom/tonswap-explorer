const SwapPairLiquidityPools = require("../../../models/SwapPairLiquidityPools");
const { convertLPInfoFromDB } = require("../utils/converterFromDB");

const swapPairLPInfo = {
    /**
     * @type {SwapPairLiquidityPools}
     */
    _swapPairLPInfoTable: undefined,

    set SwapPairLPInfoTable(table) {
        this._swapPairLPInfoTable = table;
    },

    get SwapPairLPInfoTable() {
        return this._swapPairLPInfoTable;
    },

    getSwapPairLPInfoById: async function(swapPairId, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairLPInfo = [];
        try {
            swapPairLPInfo = await this._swapPairLPInfoTable.findAll({
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
    },

    getSwapPairLPInfoByAddress: async function(swapPairAddress, getSwapPairInformationObj, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairLPInfo = [];
        let swapPairId = await getSwapPairInformationObj.getSwapPairIdByAddress(swapPairAddress);

        if (swapPairId !== -1) {
            swapPairLPInfo = await this.getSwapPairLPInfoById(swapPairId, offset, limit);
        }

        return swapPairLPInfo;
    },

    getSwapPairLPInfoByName: async function(swapPairName, getSwapPairInformationObj, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairLPInfo = [];
        let swapPairId = await getSwapPairInformationObj.getSwapPairIdByName(swapPairName);

        if (swapPairId !== -1) {
            swapPairLPInfo = await this.getSwapPairLPInfoById(swapPairId, offset, limit);
        }

        return swapPairLPInfo;
    }
}

module.exports = swapPairLPInfo;