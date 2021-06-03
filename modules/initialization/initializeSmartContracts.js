const RootSwapPairContract = require("../smart-contract-interaction/rootSwapPairContract");
const { TonClientWrapper } = require("../tonclient-wrapper");

const { fetchInitialData } = require("../database");

const { getAbi } = require("../utils");
const contractAddresses = require('../../config/smart-contract-addresses');
const { SwapPairContract } = require("../smart-contract-interaction");
const { ROOT_SWAP_PAIR_CONTRACT_TYPE, SWAP_PAIR_CONTRACT_TYPE } = require("../utils/constants");


/**
 * 
 * @param {TonClientWrapper} tonClient 
 * @param {SmartContractAddresses} smartContractAddressesTable 
 * @returns {{rootSwapPairContract: RootSwapPairContract, swapPairsInfo: import("../database/fetchInitialDataFromDB").SmartContractAddressRecord[]}}
 */
async function createRootSwapPairContract(tonClient, smartContractAddressesTable) {
    let initialData = await fetchInitialData(smartContractAddressesTable);
    let rspExists = initialData.rootInfo.id != '-1';
    let address = rspExists ? initialData.rootInfo.smartContractAddress : contractAddresses.rootSwapPairContract;
    let rootSwapPairContract = new RootSwapPairContract(
        getAbi('rootSwapPairContract'),
        rspExists ? initialData.rootInfo.smartContractAddress : contractAddresses.rootSwapPairContract,
        tonClient,
        initialData.rootInfo.id
    );

    if (!rspExists) {
        await smartContractAddressesTable.safeAddByAddress(rootSwapPairContract.address, {
            address: rootSwapPairContract.address,
            smart_contract_type: ROOT_SWAP_PAIR_CONTRACT_TYPE
        });
    }

    return {
        rootSwapPairContract: rootSwapPairContract,
        swapPairsInfo: initialData.swapPairs
    }
}

/**
 * 
 * @param {RootSwapPairContract} rootSwapPairContract 
 * @param {import("../database/fetchInitialDataFromDB").SmartContractAddressRecord[]} swapPairsInfo 
 * @param {TonClientWrapper} tonClient
 * @param {SmartContractAddresses} smartContractAddressesTable
 * @returns {Array<SwapPairContract>}
 */
async function createSwapPairContracts(rootSwapPairContract, swapPairsInfo, tonClient, smartContractAddressesTable) {
    let swapPairContractAbi = getAbi('swapPairContract');
    let swapPairsFromGraphQL = await rootSwapPairContract.getSwapPairsInfo();
    let swapPairs = [];
    for (let spi of swapPairsFromGraphQL) {
        let index = swapPairsInfo.findIndex((element) => { return element.smartContractAddress == spi.swapPairAddress });

        if (index == -1) {
            await smartContractAddressesTable.safeAddByAddress(spi.swapPairAddress, {
                address: spi.swapPairAddress,
                smart_contract_type: SWAP_PAIR_CONTRACT_TYPE
            });
        }

        let smartContractIndex = (await smartContractAddressesTable.getRecordByAddress(spi.swapPairAddress)).id;

        swapPairs.push(new SwapPairContract(
            swapPairContractAbi,
            spi.swapPairAddress,
            tonClient,
            smartContractIndex
        ))
    }

    return swapPairs;
}

module.exports = {
    createRootSwapPairContract,
    createSwapPairContracts
}