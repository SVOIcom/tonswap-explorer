const {Op} = require('sequelize');


const SwapEvents = require('./SwapEvents');
const ProvideLiquidityEvents = require('./ProvideLiquidityEvents');
const WithdrawLiquidityEvents = require('./WithdrawLiquidityEvents');
const SwapPairInformation = require('./SwapPairInformation');
const {
    convertSwapPairEvent,
    convertSwapEventsFromDB,
    convertProvideLiquidityEventsFromDB,
    convertWithdrawLiquidityEventsFromDB
} = require('../modules/utils/converterFromDB');
const { DataBaseNotAvailable } = require('../modules/utils/customException');
const ModelTemplate = require('./_Model');

const {
    SWAP_EVENT_ID,
    PROVIDE_LIQUIDITY_EVENT_ID,
    WITHDRAW_LIQUIDITY_EVENT_ID
} = require('../modules/tonDataCollector/modules/utils/constants');
const config = require('../config');


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

    static async getPageOfSwapPairEventsBySwapPairId(swapPairId, page = 0, pageSize = 100) {
        return await SwapPairEvents.getSwapPairEventsBySwapPairId(swapPairId, page * pageSize, pageSize);
    }

    static async getPageOfSwapPairEventsBySwapPairAddress(swapPairAddress, page = 0, pageSize = 100) {
        return await SwapPairEvents.getSwapPairEventsBySwapPairAddress(swapPairAddress, page * pageSize, pageSize);
    }

    static async getPageOfSwapPairEventsBySwapPairName(swapPairName, page = 0, pageSize = 100) {
        return await SwapPairEvents.getSwapPairEventsBySwapPairName(swapPairName, page * pageSize, pageSize);
    }

    static async getSwapPairEventsRaw(pairRootAddress, offset, limit){
        let events = [];
        try {
            events = (await SwapPairEvents.sequelize.query('SELECT \n' +
                '    *\n' +
                'FROM\n' +
                '    swap_pair_events \n' +
                '    JOIN swap_pair_information ON swap_pair_information.id = swap_pair_events.swap_pair_id\n' +
                '    LEFT JOIN swap_events ON swap_events.tx_id = swap_pair_events.tx_id\n' +
                '    LEFT JOIN withdraw_liquidity_events ON withdraw_liquidity_events.tx_id = swap_pair_events.tx_id\n' +
                '\tLEFT JOIN provide_liquidity_events ON provide_liquidity_events.tx_id = swap_pair_events.tx_id\n' +
                `    WHERE  swap_pair_information.swap_pair_address = '${pairRootAddress}' ORDER BY timestamp DESC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`))[0]
            //events = events.map((element) =>  element.tokenAddress);
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairEvents');
        }
        return events;
    }

    /**
     * 
     * @param {String} pairRootAddress 
     * @param {Number} numOfDays 
     * @returns {Promise< {groupedData: {date: string, count: Number} } >}
     */
    static async getRecentEventsCountGroupedByDay(numOfDays=30) {
        if (numOfDays < 1 || typeof numOfDays !== 'number')  //TODO вынести группировку по дню для графиков в отдельные методы
            return null;

        numOfDays  = Math.floor(numOfDays);

        const oneDay = 24*60*60;
        const now = Math.floor(Date.now() / 1000); // seconds

        let startTs = now - numOfDays*oneDay;
        startTs = Math.floor(startTs / oneDay) * oneDay;

        let groupByDate;
        if(config.isSqllite) {
            groupByDate = this.sequelize?.fn('date', this.sequelize?.col('timestamp'), 'unixepoch');
        } else {
            groupByDate = this.sequelize?.fn('date_format', this.sequelize?.fn('from_unixtime', this.sequelize?.col('timestamp')), '%Y-%m-%d');
        }

        const res = await this.findAll({
            where:{ 
                timestamp: { [Op.gte]: startTs  } 
            },

            attributes: [
                [groupByDate, 'date'],
                [this.sequelize.fn('count', this.sequelize.col('id')), 'count']
            ],

            group: [
                'date'
            ]
        });

        return {
            groupedData: res?.map( d => ({...d.dataValues}) )
        }
    }
}



module.exports = SwapPairEvents;