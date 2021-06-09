/**
 * @typedef SmartContractAddressRecord
 * @type {Object}
 * 
 * @param {Number} id
 * @param {String} smartContractAddress
 */

/**
 * 
 * @param {SmartContractAddresses} smartContractAddressesTable 
 * @returns {Promise< {rootContract: SmartContractAddressRecord, swapPairs: SmartContractAddressRecord[]}> }
 */
async function fetchInitialData(smartContractAddressesTable) {
    let rootInfo = await smartContractAddressesTable.findOne({ where: { smart_contract_type: 0 } });
    let swapPairInfo = await smartContractAddressesTable.findAll({ where: { smart_contract_type: 1 } });
    rootInfo = {
        id: rootInfo ? rootInfo.id : -1,
        smartContractAddress: rootInfo ? rootInfo.address : ''
    }

    let swapPairs = [];
    if (swapPairInfo) {
        for (let spi of swapPairInfo) {
            swapPairs.push({
                id: spi.id,
                smartContractAddress: spi.address
            })
        }
    }

    return {
        rootInfo,
        swapPairs
    }
}

module.exports = {
    fetchInitialData
}