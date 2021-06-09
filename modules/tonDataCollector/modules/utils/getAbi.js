const fs = require('fs');
const { dirname } = require('path');
const path = require('path')

// module.exports = (contractName) => {
//     if (contractName == 'rootSwapPairContract') {
//         return JSON.parse(fs.readFileSync('./abi/RootSwapPairContract.abi.json'));
//     }
//     if (contractName == 'swapPairContract') {
//         return JSON.parse(fs.readFileSync('./abi/SwapPairContract.abi.json'));
//     }
//     return '';
// }

const _dname = dirname(__filename);
const mainPath = path.join(_dname, '..', '..', 'abi');

function getAbi(contractName) {
    if (contractName == 'rootSwapPairContract') {
        const p = path.join(mainPath, 'RootSwapPairContract.abi.json');
        return JSON.parse(fs.readFileSync(p));
    }
    if (contractName == 'swapPairContract') {
        const p =  path.join(mainPath, 'SwapPairContract.abi.json');
        return JSON.parse(fs.readFileSync(p));
    }
    return '';
}

module.exports = getAbi;