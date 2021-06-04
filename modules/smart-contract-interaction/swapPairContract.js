const { abiContract } = require("@tonclient/core");
const { ContractWrapper } = require("../smart-contract-wrapper");

class SwapPairContract extends ContractWrapper {
    /**
     * 
     * @param {Object} abi 
     * @param {String} address 
     * @param {TonClientWrapper} tonClient 
     * @param {Number} smartContractId
     */
    constructor(abi, address, tonClient, smartContractId) {
        super(abi, address, tonClient, smartContractId);
        this.abiContract = abiContract(this.abi);
        this.latestUpdateTime = 0;
    }

    async getLiquidityPools() {
        let poolsInfo = await this.runLocal(
            'getCurrentExchangeRate', {
                _answer_id: 0
            }
        )
        return {
            lpi: poolsInfo.lpi,
            swapPairId: this.smartContractId,
            timestamp: Date.now()
        };
    }

    async getSwapPairInformation() {
        return await this.runLocal('getPairInfo', {});
    }
}

module.exports = SwapPairContract;