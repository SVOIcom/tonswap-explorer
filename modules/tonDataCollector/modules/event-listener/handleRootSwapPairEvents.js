const logger = new(require("../../../utils/logger"))();
const { SwapPairContract } = require("../smart-contract-interaction");
const { getAbi, converter } = require("../utils");
const { SWAP_PAIR_INITIALIZED_EVENT_NAME, SWAP_PAIR_CONTRACT_TYPE } = require("../utils/constants");

/**
 * 
 * @param {Array<any>} rootSwapPairEvents 
 * @param {SmartContractAddresses} SmartContractAddresses 
 * @param {SwapPairInformation} SwapPairInformation 
 * @returns {Promise<Array<SwapPairContract>>}
 */
async function updateSwapPairsIfRequired(rootSwapPairEvents, tonClient, SmartContractAddresses, SwapPairInformation) {
    let swapPairInitialzedEvents = rootSwapPairEvents
        .filter(element => element.name == SWAP_PAIR_INITIALIZED_EVENT_NAME);

    let newSwapPairs = [];
    let swapPairAbi = getAbi('swapPairContract');
    for (let event of swapPairInitialzedEvents) {
        let smartContractInfo = await SmartContractAddresses.getRecordByAddress(event.value.swapPairAddress);
        if (!smartContractInfo) {
            try {
                await SmartContractAddresses.safeAddByAddress(event.value.swapPairAddress, {
                    address: event.value.swapPairAddress,
                    smart_contract_type: SWAP_PAIR_CONTRACT_TYPE
                });
            } catch (err) {
                logger.error(err);
            }

            let smartContractIndex = undefined;
            try {
                smartContractIndex = (await SmartContractAddresses.getRecordByAddress(event.value.swapPairAddress)).id;
                newSwapPairs.push(new SwapPairContract(
                    swapPairAbi,
                    event.value.swapPairAddress,
                    tonClient,
                    smartContractIndex
                ));
            } catch (err) {
                logger.error(err);
            }

            try {
                let swapPairInfo = await newSwapPairs[newSwapPairs.length - 1].getSwapPairInformation();
                await SwapPairInformation.safeAddInformation(
                    swapPairInfo.info.swapPairAddress,
                    converter.swapPairInfoToDB(smartContractIndex, swapPairInfo.info)
                );
            } catch (err) {
                logger.error(err);
                newSwapPairs = newSwapPairs.splice(0, newSwapPairs.length - 1);
            }
        }
    }

    return newSwapPairs;
}

module.exports = {
    updateSwapPairsIfRequired
}