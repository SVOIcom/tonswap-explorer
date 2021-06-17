/*_______ ____  _   _  _____
 |__   __/ __ \| \ | |/ ____|
    | | | |  | |  \| | (_____      ____ _ _ __
    | | | |  | | . ` |\___ \ \ /\ / / _` | '_ \
    | | | |__| | |\  |____) \ V  V / (_| | |_) |
    |_|  \____/|_| \_|_____/ \_/\_/ \__,_| .__/
                                         | |
                                         |_| */
/**
 * @name TONSwap project - tonswap.com
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 */

const ModelTemplate = require('./_Model');

class KeyValue extends ModelTemplate {
    static get _tableName() {
        return 'keyvalue';
    }

    static get _tableFields() {
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true,
                autoIncrement: true
            },
            key: {
                type: this.Types.STRING(255),
                unique: true
            },
            value: this.CustomTypes.FJSON('value'),
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

    /**
     * Get keyvalue element
     * @param {string} key
     * @param {object|*} defaultValue
     * @returns {Promise<*>}
     */
    static async get(key, defaultValue = undefined) {
        try {
            let field = (await KeyValue.findOne({where: {key}}));
            if(!field) {
                return defaultValue;
            }
            return field.value;
        } catch (e) {
            return defaultValue
        }
    }


    /**
     * Set keyvalue element
     * @param {string} key
     * @param {object|*} value
     * @returns {Promise<KeyValue>}
     */
    static async set(key, value) {
        let element = await KeyValue.get(key, 'nosuchelement');

        if(element === 'nosuchelement') {
            return await KeyValue.create({
                key, value
            });
        }
    }

}


module.exports = KeyValue;