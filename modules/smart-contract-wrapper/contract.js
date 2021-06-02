const { abiContract } = require("@tonclient/core");
const { TonClientWrapper } = require("../tonclient-wrapper");

class ContractWrapper {
    /**
     * 
     * @param {Object} abi 
     * @param {String} address 
     * @param {TonClientWrapper} tonClient 
     */
    constructor(abi, address, tonClient) {
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
     * @param {Number} lastTimestamp 
     */
    async getLatestEvents(lastTimestamp) {
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

        let message_collection = await this.ton.net.query_collection({
            collection: 'messages',
            filter: filter,
            order: [{
                path: 'created_at',
                direction: 'DESC'
            }],
            result: requiredResults
        });

        let decoded_messages = [];
        let decoded_message = '';
        for (let index = 0; index < message_collection.result.length; index++) {
            decoded_message = await this.ton.abi.decode_message_body({
                body: message_collection.result[index].body,
                is_internal: true,
                abi: this.abiContract
            });
            if (decoded_message.body_type == 'Event') {
                decoded_messages.push({
                    name: decoded_message.name,
                    value: decoded_message.value,
                    timestamp: message_collection.result[index].created_at
                });
            }
        }

        if (decoded_messages.length !== 0)
            this.latestUpdateTime = decoded_messages[0].timestamp;

        return decoded_messages;
    }
}

module.exports = {
    ContractWrapper
}