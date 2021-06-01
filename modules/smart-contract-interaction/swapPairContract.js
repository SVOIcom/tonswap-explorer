const { abiContract } = require("@tonclient/core");
const { ContractWrapper } = require("../smart-contract-wrapper");

class SwapPairContract extends ContractWrapper {
    /**
     * 
     * @param {Object} abi 
     * @param {String} address 
     * @param {TonClientWrapper} tonClient 
     */
    constructor(abi, address, tonClient) {
        super(abi, address, tonClient);
        this.abiContract = abiContract(this.abi);
        this.latestUpdateTime = 0;
    }

    async getLiquidityPools() {
        let poolsInfo = await this.runLocal(
            'getCurrentExchangeRate', {
                _answer_id: 0
            }
        )
        return poolsInfo.lpi;
    }
}

module.exports = SwapPairContract;