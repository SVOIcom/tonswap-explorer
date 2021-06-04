const { RootSwapPairContract, SwapPairContract } = require("./modules/smart-contract-interaction");
let networkAddress = require('./config/network')('devnet');
const contractAddresses = require('./config/smart-contract-addresses');
const fs = require('fs');
const { TonClientWrapper } = require("./modules/tonclient-wrapper");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    let rspAbi = JSON.parse(fs.readFileSync('./abi/RootSwapPairContract.abi.json'));
    let spAbi = JSON.parse(fs.readFileSync('./abi/SwapPairContract.abi.json'));

    let ton = new TonClientWrapper({
        network: networkAddress,
        message_expiration_timeout: 30000
    });

    await ton.setupKeys('melody clarify hand pause kit economy bind behind grid witness cheap tomorrow');
    console.log(ton.getKeyPair());

    try {
        let rsp = new RootSwapPairContract(rspAbi, contractAddresses.rootSwapPairContract, ton);
        let spInfo = await rsp.getSwapPairsInfo();
        let events = await rsp.getLatestEvents();
        console.log(events[0].timestamp);
        let swapPairs = [];
        for (index = 0; index < spInfo.length; index++)
            swapPairs.push(new SwapPairContract(spAbi, spInfo[index].swapPairAddress, ton));
        while (true) {
            for (let index = 0; index < swapPairs.length; index++) {
                events = await swapPairs[index].getLatestEvents();
                if (events.length !== 0) {
                    console.log(events);
                    console.log(await swapPairs[index].getLiquidityPools());
                }
            }
            await sleep(1000);
        }
    } catch (err) {
        console.log(err);
    }
}

main();