const { converter } = require("../utils")
const logger = new(require("../../../utils/logger"))();

const writeLPStates = {

    liquidityTable: undefined,

    /**
     * 
     * @param {Array<{lpi: Any, swapPairId: Number, timestamp: Number}>} lpStates 
     */
    writeUpdatedLPStates: async function(lpStates) {
        let lpInfo = lpStates.map((element) => converter.liquidityPoolsInfoToDB(element));
        try {
            await this.liquidityTable.bulkCreate(lpInfo, {
                ignoreDuplicates: true
            });
        } catch (err) {
            logger.error(err);
        }
    }
}

module.exports = {
    writeLPStates
}