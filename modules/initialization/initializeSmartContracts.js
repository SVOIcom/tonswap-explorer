const RootSwapPairContract = require("../smart-contract-interaction/rootSwapPairContract");
const { TonClientWrapper } = require("../tonclient-wrapper");
const { Model } = require("sequelize/types");

const { fetchInitialData } = require("../database");

const { getAbi } = require("../utils");
const contractAddresses = require('../../config/smart-contract-addresses');
const { SwapPairContract } = require("../smart-contract-interaction");
const { ROOT_SWAP_PAIR_CONTRACT_TYPE, SWAP_PAIR_CONTRACT_TYPE } = require("../utils/constants");


/**
 * 
 * @param {Model} smartContractAddressesTable 
 * @param {TonClientWrapper} tonClient 
 * @returns {{rootSwapPairContract: RootSwapPairContract, swapPairsInfo: import("../database/fetchInitialDataFromDB").SmartContractAddressRecord[]}}
 */
async function createRootSwapPairContract(smartContractAddressesTable, tonClient) {
    let initialData = await fetchInitialData(smartContractAddressesTable);
    let rspExists = initialData.rootContract.id != '-1';
    let rootSwapPairContract = new RootSwapPairContract(
        getAbi('rootSwapPairContract'),
        rspExists ? initialData.rootContract.address : contractAddresses.rootSwapPairContract,
        tonClient,
        initialData.rootContract.id
    );
    if (!rspExists) {
        smartContractAddressesTable.safeAddByAddress(contractAddresses.rootSwapPairContract, {
            address: contractAddresses.rootSwapPairContract,
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
 * @param {Model} smartContractAddressesTable
 * @returns {Array<SwapPairContract>}
 */
async function createSwapPairContracts(rootSwapPairContract, swapPairsInfo, tonClient, smartContractAddressesTable) {
    let swapPairContractAbi = getAbi('swapPairContract');
    let swapPairsFromGraphQL = await rootSwapPairContract.getSwapPairsInfo();
    let swapPairs = [];
    for (let spi of swapPairsFromGraphQL) {
        let index = swapPairsInfo.findIndex((element) => { return element.address == spi });
        let smartContractIndex = 0;

        if (index == -1) {
            smartContractAddressesTable.safeAddByAddress(spi, {
                address: spi,
                smart_contract_type: SWAP_PAIR_CONTRACT_TYPE
            });
        }

        swapPairs.push(new SwapPairContract(
            swapPairContractAbi,
            spi,
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