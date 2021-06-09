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
    set SwapPairEventsTable(table) {
        this._swapPairEventsTable = table;
    },
    get SwapPairEventsTable() {
        return this._swapPairEventsTable;
    },

    /**
     * @type {SwapEvents}
     */
    _swapEventsTable: undefined,
    set SwapEventsTable(table) {
        this._swapEventsTable = table;
    },
    get SwapEventsTable() {
        return this._swapEventsTable;
    },

    /**
     * @type {WithdrawLiquidityEvents}
     */
    _withdrawLiquidityEventsTable: undefined,
    set WithdrawLiquidityEventsTable(table) {
        this._withdrawLiquidityEventsTable = table;
    },
    get WithdrawLiquidityEventsTable() {
        return this._withdrawLiquidityEventsTable;
    },

    /**
     * @type {ProvideLiquidityEvents}
     */
    _provideLiquidityEventsTable: undefined,
    set ProvideLiqudityEventsTable(table) {
        this._provideLiquidityEventsTable = table;
    },
    get ProvideLiqudityEventsTable() {
        return this._provideLiquidityEventsTable;
    },

    getSwapPairEventsBySwapPairId: async function(swapPairId, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        try {
            swapPairEvents = await this._swapPairEventsTable.findAll({
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
    },

    getSwapPairEventsBySwapPairAddress: async function(swapPairAddress, getSwapPairInformationObj, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        let swapPairId = await getSwapPairInformationObj.getSwapPairIdByAddress(swapPairAddress);

        if (swapPairId !== -1) {
            swapPairEvents = await this.getSwapPairEventsBySwapPairId(swapPairId, offset, limit);
        }

        return swapPairEvents;
    },

    getSwapPairEventsBySwapPairName: async function(swapPairName, getSwapPairInformationObj, offset = 0, limit = 100) {
        /**
         * @type {Array<Object>}
         */
        let swapPairEvents = [];
        let swapPairId = await getSwapPairInformationObj.getSwapPairIdByName(swapPairName);

        if (swapPairId !== -1) {
            swapPairEvents = await this.getSwapPairEventsBySwapPairId(swapPairId, offset, limit);
        }

        return swapPairEvents;
    }
}

module.exports = getEventsFromDB;