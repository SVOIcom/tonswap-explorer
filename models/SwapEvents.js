const ModelTemplate = require('./_Model');
const {Sequelize, Op} = require('sequelize');

const config = require('../config');
const SwapPairInformation = require('./SwapPairInformation');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)





class SwapEvents extends ModelTemplate {
    static get _tableName() {
        return 'swap_events';
    }

    static get _tableFields() {
        let addressType = this.CustomTypes.TON_ADDRESS;
        let numbersType = this.CustomTypes.NUMBER;
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            tx_id: {
                type: this.CustomTypes.TON_TX,
                unique: true
            },
            swap_pair_id:         { type: this.CustomTypes.ID },
            provided_token_root:  { type: addressType },
            target_token_root:    { type: addressType },
            tokens_used_for_swap: { type: numbersType },
            tokens_received:      { type: numbersType },
            fee:                  { type: numbersType },
            timestamp:            { type: this.CustomTypes.TIMESTAMP }
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
        return SwapEvents.findOne({ where: { tx_id: txId } });
    }


    /**
     * 
     * @param {String} swapPairAddress 
     * @param {Number} [numOfDays=30]
     * 
     * @returns { Promise<null> | Promise<{
     *      swapPairAddress: String
     *      token1:          String, 
     *      token2:          String, 
     *      groupedData:     GroupedSwapEvents[]
     * }> }
     */
    static async getRecentDataGroupedByDay(swapPairAddress, numOfDays=30) {
        const tokens = await SwapPairInformation.getSwapPairTokens(swapPairAddress);
        if (!tokens || !tokens.swapPairId)
            return null;

        const data = await this._getRecentDataGroupedByDay(tokens.swapPairId, numOfDays);

        const result = {
            swapPairAddress: swapPairAddress, 
            token1: tokens.token1, 
            token2: tokens.token2,
            groupedData: data
        };

        return result;
    }


    /**
     * Returns stats to compare data for the last 24 hours
     * @param {string} swapPairAddress 
     * @returns {object}
     */
    static async getRecentDaysStats(swapPairAddress) {
        const tokens = await SwapPairInformation.getSwapPairTokens(swapPairAddress);
        if (!tokens || !tokens.swapPairId)
            return null;

        const now = Math.floor(Date.now() / 1000);
        const oneDay =  24*60*60;
        const middle = now - oneDay;
        const startTs = middle - oneDay;

        const data = await this.findAll({
            where: {
                [Op.and]: [
                    { swap_pair_id: tokens.swapPairId },
                    { timestamp: { [Op.gte]: startTs  } }
                ]
            },

            attributes: [
                ['provided_token_root', 'providedTokenRoot'],
                ['target_token_root', 'targetTokenRoot'],
                [this.sequelize.fn('sum', this.sequelize.col('tokens_used_for_swap')), 'swaped'  ],
                [this.sequelize.fn('sum', this.sequelize.col('tokens_received')),      'received'],
                [this.sequelize.fn('sum', this.sequelize.col('fee')),                  'fee'     ],
                [this.sequelize.literal(`timestamp / ${middle}`),                      'date'    ],
                [this.sequelize.fn('count', this.sequelize.col('id')),                 'count'   ]
            ],

            group: [
                'providedTokenRoot',
                'targetTokenRoot',
                'date'
            ]
        })


        const result = {
            swapPairAddress: swapPairAddress, 
            token1: tokens.token1, 
            token2: tokens.token2,
            groupedData: data.map(x => x.dataValues)
        };

        return result;
    }


    static async safeAddSwapEvent(information) {
        let recordExists = await SwapEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await SwapEvents.create({
                ...information
            });
        }
    }


    /**
     * @param {String} swapPairId 
     * @param {Number} numOfDays 
     * 
     * @returns {Promise< GroupedSwapEvents[] >} 
     */
    static async _getRecentDataGroupedByDay(swapPairId, numOfDays=30) {
        if (numOfDays < 1 || typeof numOfDays !== 'number')      //TODO вынести группировку по дню для графиков в отдельные методы
            return [];
        
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
            where: {
                [Op.and]: [
                    { swap_pair_id: swapPairId },
                    { timestamp: { [Op.gte]: startTs  } }
                ]
            },

            attributes: [
                ['provided_token_root', 'providedTokenRoot'],
                ['target_token_root', 'targetTokenRoot'],
                [this.sequelize.fn('sum', this.sequelize.col('tokens_used_for_swap')), 'swaped'  ],
                [this.sequelize.fn('sum', this.sequelize.col('tokens_received')),      'received'],
                [this.sequelize.fn('sum', this.sequelize.col('fee')),                   'fee'    ],
                [groupByDate,                                                           'date'   ],
                [this.sequelize.fn('count', this.sequelize.col('id')),                  'count'  ]

            ],

            group: [
                'provided_token_root',
                'target_token_root',
                'date'
            ]
        });

        return res.map(x => ({ ...(x.dataValues) }) );
    }
}



module.exports = SwapEvents;





/**
 * @typedef GroupedSwapEvents
 * @type {Object}
 * 
 * @property {string} providedTokenRoot
 * @property {string} targetTokenRoot
 * @property {number} swaped
 * @property {number} received
 * @property {number} fee
 * @property {string} date
 * @property {number} count
 */