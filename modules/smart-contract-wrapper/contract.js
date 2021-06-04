const { abiContract } = require("@tonclient/core");
const { TonClientWrapper } = require("../tonclient-wrapper");

/**
 * @typedef EventType
 * @type {Object}
 * 
 * @property {String} name
 * @property {Object} value
 * @property {Number} swapPairId
 * @property {String} txId
 * @property {Number} timestamp
 */

class ContractWrapper {
    /**
     * 
     * @param {Object} abi 
     * @param {String} address 
     * @param {TonClientWrapper} tonClient 
     * @param {Number} smartContractId
     */
    constructor(abi, address, tonClient, smartContractId) {
        this.abi = abi;
        this.address = address;
        this.ton = tonClient.getTonClient();
        this.keyPair = tonClient.getKeyPair();
        this.abiContract = abiContract(this.abi);
        /**
         * @type {import("@tonclient/core").ResultOfSubscribeCollection}
         */
        this.subscribeObj = undefined;
        this.latestUpdateTime = 0;
        this.smartContractId = smartContractId;
    }

    async runLocal(functionName, input = {}) {
        const account = (await this.ton.net.query_collection({
            collection: 'accounts',
            filter: { id: { eq: this.address } },
            result: 'boc'
        })).result[0].boc;

        const message = await this.ton.abi.encode_message({
            abi: this.abiContract,
            address: this.address,
            call_set: {
                function_name: functionName,
                input: input
            },
            signer: {
                type: 'Keys',
                keys: this.keyPair
            }
        });

        let response = await this.ton.tvm.run_tvm({
            message: message.message,
            account: account,
            abi: this.abiContract
        });

        return response.decoded.output;
    }

    /**
     * 
     * @returns {Promise<Array<EventType>>}
     */
    async getLatestEvents() {
        let filter = {
            src: { eq: this.address },
            msg_type: { eq: 2 }
        };
        let requiredResults = 'id body created_at'
        if (this.latestUpdateTime !== 0) {
            filter = {
                ...filter,
                created_at: { gt: this.latestUpdateTime }
            };
        }

        let messageCollection = await this.ton.net.query_collection({
            collection: 'messages',
            filter: filter,
            order: [{
                path: 'created_at',
                direction: 'DESC'
            }],
            result: requiredResults
        });

        let decodedMessages = [];
        let decodedMessage = '';
        for (let message of messageCollection.result) {
            decodedMessage = await this.ton.abi.decode_message_body({
                body: message.body,
                is_internal: true,
                abi: this.abiContract
            });
            if (decodedMessage.body_type == 'Event') {
                decodedMessages.push({
                    name: decodedMessage.name,
                    value: decodedMessage.value,
                    txId: message.id,
                    timestamp: message.created_at,
                    swapPairId: this.smartContractId,
                });
            }
        }

        if (decodedMessages.length !== 0)
            this.latestUpdateTime = decodedMessages[0].timestamp;

        this.smartContractId
        return decodedMessages;
    }
}

module.exports = {
    ContractWrapper
}