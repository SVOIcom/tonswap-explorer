const { TonClient } = require('@tonclient/core');
const { libNode } = require("@tonclient/lib-node");
TonClient.useBinaryLibrary(libNode);

/**
 * @typedef TonclientConfig
 * @type {Object}
 * 
 * @property {String} network network to connect to
 * @property {Number} message_expiration_timeout Expiration timeout of message
 */

class TonClientWrapper {
    /**
     * 
     * @param {TonclientConfig} tonclientConfig 
     */
    constructor(tonclientConfig) {
        /**
         * @type {TonClient}
         */
        this.ton = new TonClient({
            network: {
                server_address: tonclientConfig.network
            },
            abi: {
                message_expiration_timeout: tonclientConfig.message_expiration_timeout
            }
        });

        /**
         * @type {import('@tonclient/core').KeyPair}
         */
        this.keyPair = {};
    }

    /**
     * 
     * @param {String} seedPhrase 
     */
    async setupKeys(seedPhrase) {
        // magic
        const keysHDPath = `m/44'/396'/0'/0/0`;

        this.keyPair = await this.ton.crypto.mnemonic_derive_sign_keys({
            dictionary: 1,
            wordCount: 12,
            phrase: seedPhrase,
            keysHDPath,
        });
    }

    /**
     * 
     * @returns {TonClient}
     */
    getTonClient() {
        return this.ton;
    }

    /**
     * 
     * @returns {import('@tonclient/core').KeyPair}
     */
    getKeyPair() {
        return this.keyPair;
    }
}

module.exports = {
    TonClientWrapper
}