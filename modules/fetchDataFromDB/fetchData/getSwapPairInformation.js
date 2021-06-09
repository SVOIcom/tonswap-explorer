const SwapPairInformation = require("../../../models/SwapPairInformation");
const { convertSPInfoFromDB } = require("../utils/converterFromDB");

const getSwapPairInformation = {
    /**
     * @type {SwapPairInformation}
     */
    _swapPairInformationTable: undefined,

    set SwapPairInformationTable(table) {
        this._swapPairInformationTable = table;
    },

    get SwapPairInformation() {
        return this._swapPairInformationTable;
    },

    getSwapPairs: async function(offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairs = [];
        try {
            swapPairs = await this._swapPairInformationTable.findAll({
                offset: offset,
                limit: limit,
                order: [
                    ['id', 'DESC']
                ]
            });
            swapPairs = swapPairs.map((element) => convertSPInfoFromDB(element.dataValues));
        } catch (err) {
            console.log(err);
        }
        return swapPairs;
    },

    getSwapPairIdByAddress: async function(swapPairAddress) {
        let swapPairId = -1;
        try {
            swapPairId = await this._swapPairInformationTable.findOne({ where: { swap_pair_address: swapPairAddress } });
            swapPairId = swapPairId.dataValues.id;
        } catch (err) {
            console.log(err);
        }
        return swapPairId;
    },

    getSwapPairIdByName: async function(swapPairName) {
        let swapPairId = -1;
        try {
            swapPairId = await this._swapPairInformationTable.findOne({ where: { swap_pair_name: swapPairName } });
            swapPairId = swapPairId.dataValues.id;
        } catch (err) {
            console.log(err);
        }
        return swapPairId;
    }
}

module.exports = getSwapPairInformation;