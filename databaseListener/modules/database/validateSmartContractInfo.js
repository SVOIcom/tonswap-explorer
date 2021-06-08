const { SwapPairContract } = require("../smart-contract-interaction");
const { getAbi } = require("../utils");
const { SWAP_PAIR_CONTRACT_TYPE } = require("../utils/constants")

const swapPairDBValidation = {
    SmartContractAddresses: undefined,
    SwapPairInformation: undefined,
    validateDB: async function(tonClient) {
        let swapPairs = await this.SmartContractAddresses.findAll({ where: { smart_contract_type: SWAP_PAIR_CONTRACT_TYPE } });
        let missingSwapPairs = [];
        let swapPairAbi = getAbi('swapPairContract');
        for (let swapPair of swapPairs) {
            let swapPairInfoDB = await this.SwapPairInformation.findOne({ where: { id: swapPair.dataValues.id } });
            if (!swapPairInfoDB) {
                missingSwapPairs.push(new SwapPairContract(
                    swapPairAbi,
                    swapPair.dataValues.address,
                    tonClient,
                    swapPair.dataValues.id
                ));
                try {
                    let swapPairInfo = await missingSwapPairs[missingSwapPairs.length - 1].getSwapPairInformation();
                    await this.SwapPairInformation.safeAddInformation(
                        swapPairInfo.info.swapPairAddress,
                        converter.swapPairInfoToDB(smartContractIndex, swapPairInfo.info)
                    );
                } catch {
                    console.log(err);
                    missingSwapPairs = missingSwapPairs.splice(0, missingSwapPairs.length - 1);
                }
            }
        }
        return missingSwapPairs;
    }
}

module.exports = swapPairDBValidation;