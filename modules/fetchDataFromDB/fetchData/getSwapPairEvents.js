const {
    SwapPairEvents,
    SwapEvents,
    ProvideLiquidityEvents,
    WithdrawLiquidityEvents
} = require('../../../models/index');

const {
    SWAP_EVENT_ID,
    PROVIDE_LIQUIDITY_EVENT_ID,
    WITHDRAW_LIQUIDITY_EVENT_ID
} = require('../../tonDataCollector/modules/utils/constants');

const {
    convertSwapPairEvent,
    convertSwapEventsFromDB,
    convertProvideLiquidityEventsFromDB,
    convertWithdrawLiquidityEventsFromDB
} = require('../utils/converterFromDB');

const getEventsFromDB = {
    /**
     * @type {SwapPairEvents}
     */
    _swapPairEventsTable: undefined,
    set SwapPairInformationTable(table) {
        this._swapPairInformationTable = table;
    },
    get SwapPairInformation() {
        return this._swapPairInformationTable;
    },

    /**
     * @type {SwapEvents}
     */
    _swapEventsTable: undefined,
    set SwapPairInformationTable(table) {
        this._swapPairInformationTable = table;
    },
    get SwapPairInformation() {
        return this._swapPairInformationTable;
    },

    /**
     * @type {WithdrawLiquidityEvents}
     */
    _withdrawLiquidityEventsTable: undefined,
    set SwapPairInformationTable(table) {
        this._swapPairInformationTable = table;
    },
    get SwapPairInformation() {
        return this._swapPairInformationTable;
    },

    /**
     * @type {ProvideLiquidityEvents}
     */
    _provideLiquidityEventsTable: undefined,
    set SwapPairInformationTable(table) {
        this._swapPairInformationTable = table;
    },
    get SwapPairInformation() {
        return this._swapPairInformationTable;
    },

    getSwapPairEventsBySwapPairId: async function(swapPairId, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        try {
            swapPairEvents = await this._swapEventsTable.findAll({
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
        }

        let swapEvents = swapPairEvents.filter((element) => element.eventType == SWAP_EVENT_ID);
        let provideLiquidityEvents = swapPairEvents.filter((element) => element.eventType == PROVIDE_LIQUIDITY_EVENT_ID);
        let withdrawLiquidityEvents = swapPairEvents.filter((element) => element.eventType == WITHDRAW_LIQUIDITY_EVENT_ID);

        try {
            let swapEventsTxIds = swapEvents.map((element) => element.tx_id);
            swapEvents = await this._swapEventsTable.findAll({
                where: { tx_id: swapEventsTxIds }
            });
            swapEvents = swapEvents.map((element) => convertSwapEventsFromDB(element.dataValues));
        } catch (err) {
            console.log(err);
            swapEvents = [];
        }

        try {
            let provideLiquidityEventsTxIds = provideLiquidityEvents.map((element) => element.tx_id);
            provideLiquidityEvents = await this._provideLiquidityEventsTable.findAll({
                where: { tx_id: provideLiquidityEventsTxIds }
            });
            provideLiquidityEvents = provideLiquidityEvents.map(
                (element) => convertProvideLiquidityEventsFromDB(element.dataValues)
            );
        } catch (err) {
            console.log(err);
            provideLiquidityEvents = [];
        }

        try {
            let withdrawLiquidityEventsTxIds = withdrawLiquidityEvents.map((element) => element.tx_id);
            withdrawLiquidityEvents = await this._withdrawLiquidityEventsTable.findAll({
                where: { tx_id: withdrawLiquidityEventsTxIds }
            });
            withdrawLiquidityEvents = withdrawLiquidityEvents.map(
                (element) => convertWithdrawLiquidityEventsFromDB(element.dataValues)
            );
        } catch (err) {
            console.log(err);
            withdrawLiquidityEvents = [];
        }

        swapPairEvents = [...swapEvents, ...provideLiquidityEvents, ...withdrawLiquidityEvents];
        swapPairEvents.sort((element1, element2) => element2.timestamp - element1.timestamp);

        return swapPairEvents;
    }
}

module.exports = getEventsFromDB;