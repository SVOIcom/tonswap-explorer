const { converter } = require("../utils")

const writeLPStates = {

    liquidityTable: undefined,

    /**
     * 
     * @param {Array<{lpi: Any, swapPairId: Number, timestamp: Number}>} lpStates 
     */
    writeUpdatedLPStates: async function(lpStates) {
        let lpInfo = lpStates.map((element) => converter.liquidityPoolsInfoToDB(element));
        await this.liquidityTable.bulkCreate(lpInfo, {
            ignoreDuplicates: true
        });
    }
}

module.exports = {
    writeLPStates
}