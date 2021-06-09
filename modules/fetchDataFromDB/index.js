const Database = require('../database');
const swapPairLPInfo = require('./fetchData/getLPInfo');
const getEventsFromDB = require('./fetchData/getSwapPairEvents');
const getSwapPairInformation = require('./fetchData/getSwapPairInformation');

if (require.main === module) {
    async function testModules() {
        const db = new Database();
        getSwapPairInformation.SwapPairInformationTable = db.models.SwapPairInformation;
        console.log(await getSwapPairInformation.getSwapPairs(0, 22));
        console.log(await getSwapPairInformation.getSwapPairIdByAddress('0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2'));
        console.log(await getSwapPairInformation.getSwapPairIdByName('Coin_3731_1<->Coin_3731_1_2 LPT'));

        swapPairLPInfo.SwapPairLPInfoTable = db.models.SwapPairLiquidityPools;
        console.log(await swapPairLPInfo.getSwapPairLPInfoById(6));
        console.log(await swapPairLPInfo.getSwapPairLPInfoByAddress(
            '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2',
            getSwapPairInformation,
            0,
            5
        ));
        console.log(await swapPairLPInfo.getSwapPairLPInfoByName(
            'Coin_3731_1<->Coin_3731_1_2 LPT',
            getSwapPairInformation,
            0,
            5
        ));

        getEventsFromDB.SwapPairEventsTable = db.models.SwapPairEvents;
        getEventsFromDB.SwapEventsTable = db.models.SwapEvents;
        getEventsFromDB.ProvideLiqudityEventsTable = db.models.ProvideLiquidityEvents;
        getEventsFromDB.WithdrawLiquidityEventsTable = db.models.WithdrawLiquidityEvents;

        console.log(await getEventsFromDB.getSwapPairEventsBySwapPairId(6, 0, 10));
        console.log(await getEventsFromDB.getSwapPairEventsBySwapPairAddress(
            '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2',
            getSwapPairInformation,
            0,
            5
        ));
        console.log(await getEventsFromDB.getSwapPairEventsBySwapPairName(
            'Coin_3731_1<->Coin_3731_1_2 LPT',
            getSwapPairInformation,
            0,
            5
        ));

        process.exit();
    }

    testModules();
}


module.exports = {
    swapPairLPInfo,
    getEventsFromDB,
    getSwapPairInformation
}