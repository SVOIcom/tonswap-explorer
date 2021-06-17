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

const KeyValue = require('./KeyValue')

class ExpiredKeyValue extends KeyValue {
    /**
     * Get keyvalue element
     * @param {string} key
     * @param {object|*} defaultValue
     * @returns {Promise<*>}
     */
    static async get(key, defaultValue = undefined) {
        key += '_expKV';
        try {
            let field = (await ExpiredKeyValue.findOne({where: {key}}));
            if(!field) {
                return defaultValue;
            }

            let experationObject = field.value;

            if(experationObject.expireIn >= +new Date()) {
                return experationObject.value;
            }

            return defaultValue;
        } catch (e) {
            return defaultValue
        }
    }


    /**
     * Set keyvalue element
     * @param {string} key
     * @param {object|*} value
     * @param {number} expire Expiration milliseconds
     * @returns {Promise<KeyValue>}
     */
    static async set(key, value, expire = 30000) {

        key += '_expKV';
        value = {expireIn: expire + +new Date(), value};

        let element = await ExpiredKeyValue.get(key, 'nosuchelement');


        if(element === 'nosuchelement') {
            return await ExpiredKeyValue.create({
                key, value
            });
        } else {
            return await ExpiredKeyValue.update({
                value
            }, {where: {key}})
        }
    }
}