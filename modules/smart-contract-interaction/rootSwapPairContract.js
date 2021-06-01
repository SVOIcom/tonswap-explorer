const { abiContract } = require("@tonclient/core");
const { ContractWrapper } = require("../smart-contract-wrapper");

/**
 * @typedef SwapPairCreated
 * @type {Object}
 * 
 * @property {String} swapPairAddress
 */

/**
 * @typedef MessageStruct
 * @type {Object}
 * 
 * @property {{boc: String, created_at: Number}} result
 */

class RootSwapPairContract extends ContractWrapper {
    /**
     * 
     * @param {Object} abi 
     * @param {String} address 
     * @param {TonClientWrapper} tonClient 
     */
    constructor(abi, address, tonClient) {
        super(abi, address, tonClient);
        this.abiContract = abiContract(this.abi);
    }

    async getSwapPairsInfo() {
        /**
         * @type {Array<BigInt>}
         */
        let swapPairsIds = await this.runLocal(
            'getAllSwapPairsID', {}
        );

        let swapPairsInfo = [];
        for (let index = 0; index < swapPairsIds.ids.length; index++)
            swapPairsInfo.push((await this.getSwapPairInfoById(swapPairsIds.ids[index])).swapPairInfo);

        return swapPairsInfo;
    }

    async getSwapPairInfoById(uniqueId) {
        return await this.runLocal('getPairInfoByID', {
            'uniqueID': uniqueId
        });
    }
}

module.exports = RootSwapPairContract;