const fs = require('fs');

module.exports = (contractName) => {
    if (contractName == 'rootSwapPairContract') {
        return JSON.parse(fs.readFileSync('./abi/RootSwapPairContract.abi.json'));
    }
    if (contractName == 'swapPairContract') {
        return JSON.parse(fs.readFileSync('./abi/SwapPairContract.abi.json'));
    }
    return '';
}