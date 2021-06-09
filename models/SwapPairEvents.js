const SwapEvents = require('./SwapEvents');
const ProvideLiquidityEvents = require('./ProvideLiquidityEvents');
const WithdrawLiquidityEvents = require('./WithdrawLiquidityEvents');
const SwapPairInformation = require('./SwapPairInformation');
const {
    convertSwapPairEvent,
    convertSwapEventsFromDB,
    convertProvideLiquidityEventsFromDB,
    convertWithdrawLiquidityEventsFromDB
} = require('../modules/fetchDataFromDB/utils/converterFromDB');
const { DataBaseNotAvailable } = require('../modules/utils/customException');
const ModelTemplate = require('./_Model');

const {
    SWAP_EVENT_ID,
    PROVIDE_LIQUIDITY_EVENT_ID,
    WITHDRAW_LIQUIDITY_EVENT_ID
} = require('../modules/tonDataCollector/modules/utils/constants');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class SwapPairEvents extends ModelTemplate {
    static get _tableName() {
        return 'swap_pair_events';
    }

    static get _tableFields() {
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            swap_pair_id: { type: this.CustomTypes.ID },
            tx_id: { type: this.CustomTypes.TON_TX, unique: true },
            event_type: { type: this.CustomTypes.ID },
            timestamp: { type: this.CustomTypes.TIMESTAMP }
        }
    }

    static get _tableOptions() {
        return {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true
        }
    }


    static async getRecordByTxId(txId) {
        return SwapPairEvents.findOne({ where: { tx_id: txId } });
    }


    static async safeAddEvent(information) {
        let recordExists = await SwapPairEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await SwapPairEvents.create({
                ...information
            });
        }
    }

    static async getSwapPairEventsBySwapPairId(swapPairId, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        try {
            swapPairEvents = await SwapPairEvents.findAll({
                where: { swap_pair_id: swapPairId },
                offset: offset,
                limit: limit,
                order: [
                    ['timestamp', 'DESC']
                ]
            });
            swapPairEvents = swapPairEvents.map((element) => convertSwapPairEvent(element.dataValues));
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairEvents');
        }

        let swapEvents = swapPairEvents.filter((element) => element.eventType == SWAP_EVENT_ID);
        let provideLiquidityEvents = swapPairEvents.filter((element) => element.eventType == PROVIDE_LIQUIDITY_EVENT_ID);
        let withdrawLiquidityEvents = swapPairEvents.filter((element) => element.eventType == WITHDRAW_LIQUIDITY_EVENT_ID);

        try {
            let swapEventsTxIds = swapEvents.map((element) => element.tx_id);
            swapEvents = await SwapEvents.findAll({
                where: { tx_id: swapEventsTxIds }
            });
            swapEvents = swapEvents.map((element) => convertSwapEventsFromDB(element.dataValues));
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapEvents');
        }

        try {
            let provideLiquidityEventsTxIds = provideLiquidityEvents.map((element) => element.tx_id);
            provideLiquidityEvents = await ProvideLiquidityEvents.findAll({
                where: { tx_id: provideLiquidityEventsTxIds }
            });
            provideLiquidityEvents = provideLiquidityEvents.map(
                (element) => convertProvideLiquidityEventsFromDB(element.dataValues)
            );
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('ProvideLiqudityEvents');
        }

        try {
            let withdrawLiquidityEventsTxIds = withdrawLiquidityEvents.map((element) => element.tx_id);
            withdrawLiquidityEvents = await WithdrawLiquidityEvents.findAll({
                where: { tx_id: withdrawLiquidityEventsTxIds }
            });
            withdrawLiquidityEvents = withdrawLiquidityEvents.map(
                (element) => convertWithdrawLiquidityEventsFromDB(element.dataValues)
            );
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('WithdrawLiquidityEvents');
        }

        swapPairEvents = [...swapEvents, ...provideLiquidityEvents, ...withdrawLiquidityEvents];
        swapPairEvents.sort((element1, element2) => element2.timestamp - element1.timestamp);

        return swapPairEvents;
    }

    static async getSwapPairEventsBySwapPairAddress(swapPairAddress, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        let swapPairId = await SwapPairInformation.getSwapPairIdByAddress(swapPairAddress);
        swapPairEvents = await SwapPairEvents.getSwapPairEventsBySwapPairId(swapPairId, offset, limit);
        return swapPairEvents;
    }

    static async getSwapPairEventsBySwapPairName(swapPairName, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        let swapPairId = await SwapPairInformation.getSwapPairIdByName(swapPairName);
        swapPairEvents = await SwapPairEvents.getSwapPairEventsBySwapPairId(swapPairId, offset, limit);
        return swapPairEvents;
    }
}



module.exports = SwapPairEvents;