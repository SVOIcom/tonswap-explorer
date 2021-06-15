const ModelTemplate = require('./_Model');
const {Sequelize, Op} = require('sequelize');

const config = require('../config')

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
     * @param {Number} swapPairId 
     * @param {Number} numOfDays 
     * @returns {  Promise< Array<
     *      {
     *          providedTokenRoot: string, 
     *          targetTokenRoot: string, 
     *          swaped: Number, 
     *          received: Number, 
     *          fee: Number, 
     *          date: string
     *      }
     * >> }
     */
    static async getVolumesByDay(swapPairId, numOfDays=30) {
        swapPairId = Math.floor(swapPairId);
        numOfDays  = Math.floor(numOfDays);

        const oneDay = 24*60*60;
        const now = Math.floor(Date.now() / 1000); // seconds

        let startTs = now - numOfDays*oneDay;
        startTs = Math.floor(startTs / oneDay) * oneDay;
        // const endTs = Math.floor(now / oneDay) * 

        let groupByDate;
        if (config.isSqllite)
            groupByDate = this.sequelize?.fn('date', this.sequelize?.col('timestamp'), 'unixepoch');
        else
            groupByDate = this.sequelize?.fn('date_format', this.sequelize?.col('timestamp'), '%Y-%m-%d');

        
        const res = this.findAll({
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
                [groupByDate,                                                           'date'   ]
            ],

            group: [
                'provided_token_root', 
                'target_token_root',
                'date'
            ]
        })

        return (await res).map(x => ({ ...(x.dataValues) }) );
    }


    static async safeAddSwapEvent(information) {
        let recordExists = await SwapEvents.getRecordByTxId(information.tx_id);
        if (!recordExists) {
            await SwapEvents.create({
                ...information
            });
        }
    }
}



module.exports = SwapEvents;