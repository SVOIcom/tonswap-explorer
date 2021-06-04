const { SwapPairContract } = require("../smart-contract-interaction");
const { getAbi, converter } = require("../utils");
const { SWAP_PAIR_INITIALIZED_EVENT_NAME } = require("../utils/constants");

/**
 * 
 * @param {Array<any>} rootSwapPairEvents 
 * @param {SmartContractAddresses} SmartContractAddresses 
 * @param {SwapPairInformation} SwapPairInformation 
 * @returns {Array<SwapPairContract>}
 */
function updateSwapPairsIfRequired(rootSwapPairEvents, tonClient, SmartContractAddresses, SwapPairInformation) {
    let swapPairInitialzedEvents = rootSwapPairEvents
        .filter(element => element.name == SWAP_PAIR_INITIALIZED_EVENT_NAME);

    let newSwapPairs = [];
    let swapPairAbi = getAbi('swapPairContract');
    for (let event in swapPairInitialzedEvents) {
        await SmartContractAddresses.safeAddByAddress(event.value.swapPairAddress, {
            address: event.value.swapPairAddress,
            smart_contract_type: SWAP_PAIR_CONTRACT_TYPE
        });

        let smartContractIndex = (await SmartContractAddresses.getRecordByAddress(event.value.swapPairAddress)).id;
        newSwapPairs.push(new SwapPairContract(
            swapPairAbi,
            event.value.swapPairAddress,
            tonClient,
            smartContractIndex
        ));
        let swapPairInfo = await newSwapPairs[newSwapPairs.length - 1].getSwapPairInformation();
        await SwapPairInformation.safeAddInformation(
            swapPairInfo.swapPairAddress,
            converter.swapPairInfoToDB(smartContractIndex, swapPairInfo)
        );
    }

    return newSwapPairs;
}

module.exports = {
    updateSwapPairsIfRequired
}