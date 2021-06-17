const {Op} = require('sequelize');

const {convertSPInfoFromDB} = require('../modules/utils/converterFromDB');
const {DataBaseNotAvailable} = require('../modules/utils/customException');
const ModelTemplate = require('./_Model');

//TODO: Паша: написать аннотации для параметров функций (а то `information` не особо информативно)

class SwapPairInformation extends ModelTemplate {
    static get _tableName() {
        return 'swap_pair_information';
    }

    static get _tableFields() {
        let addressType = this.CustomTypes.TON_ADDRESS;
        return {
            id: {
                type: this.CustomTypes.ID,
                primaryKey: true
            },
            swap_pair_address: {type: addressType},
            root_address: {type: addressType},
            token1_address: {type: addressType},
            token2_address: {type: addressType},
            lptoken_address: {type: addressType},
            wallet1_address: {type: addressType},
            wallet2_address: {type: addressType},
            lptoken_wallet_address: {type: addressType},
            swap_pair_name: {type: this.Types.STRING(200)}
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


    static async safeAddInformation(swapPairAddress, information) {
        let recordExists = await SwapPairInformation.getRecordByAddress(swapPairAddress);
        if(!recordExists) {
            await SwapPairInformation.create({
                ...information
            });
        }
    }


    /**
     * @param {String} address
     */
    static async getRecordByAddress(address) {
        return SwapPairInformation.findOne({where: {swap_pair_address: address}});
    }


    static async getSwapPairs(offset = 0, limit = 100) {
        let swapPairs = [];
        try {
            swapPairs = await SwapPairInformation.findAll({
                offset: offset,
                limit: limit,
                order: [
                    ['id', 'DESC']
                ]
            });
            swapPairs = swapPairs.map((element) => convertSPInfoFromDB(element.dataValues));
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairInformation');
        }
        return swapPairs;
    }

    static async getPageOfSwapPairs(page = 0, pageSize = 100) {
        return await SwapPairInformation.getSwapPairs(page * pageSize, pageSize);
    }

    static async getSwapPairIdByAddress(swapPairAddress) {
        let swapPairId = -1;
        try {
            swapPairId = await SwapPairInformation.findOne({where: {swap_pair_address: swapPairAddress}});
            swapPairId = swapPairId.dataValues.id;
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairInformation');
        }
        return swapPairId;
    }

    static async getSwapPairIdByName(swapPairName) {
        let swapPairId = -1;
        try {
            swapPairId = await SwapPairInformation.findOne({where: {swap_pair_name: swapPairName}});
            swapPairId = swapPairId.dataValues.id;
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairInformation');
        }
        return swapPairId;
    }



    /**
     * @param {String} swapPairAddress
     * @returns { Promise< null | {swapPairId: Number, token1: String, token2: String} >}
     */
    static async getSwapPairTokens(swapPairAddress) {
        let query = await SwapPairInformation.findOne({
            where : {swap_pair_address: swapPairAddress},

            attributes: [
                ['id', 'swapPairId'],
                ['token1_address', 'token1'],
                ['token2_address', 'token2']
            ]
        });

        if (query?.dataValues)
            return { ...query.dataValues }
        else
            return null;
    }


    /**
     * @param {Array<String>} pairAddressesList
     * @returns { Promise< Array<{swapPairId: Number, token1: String, token2: String, swapPairAddress: String}> >}
     */
    static async getSwapPairTokensAll(pairAddressesList) {
        let query = await SwapPairInformation.findAll({
            where: { swap_pair_address: pairAddressesList},

            attributes: [
                ['id', 'swapPairId'],
                ['token1_address', 'token1'],
                ['token2_address', 'token2'],
                ['swap_pair_address', 'swapPairAddress']
            ]
        });

        return query.map(a => ({ ...a.dataValues }) );
    }


    static async getTokens(offset = 0, limit = 100) {
        let tokenAddresses = [];
        try {
            tokenAddresses = (await SwapPairInformation.sequelize.query('SELECT DISTINCT * FROM (SELECT \n' +
                '    token1_address AS tokenAddress\n' +
                'FROM\n' +
                '    swap_pair_information \n' +
                'UNION SELECT \n' +
                '    token2_address AS tokenAddress\n' +
                'FROM\n' +
                `    swap_pair_information) TMP_TABLE ORDER BY tokenAddress ASC LIMIT ${Number(limit)} OFFSET ${Number(offset)}`))[0]
            tokenAddresses = tokenAddresses.map((element) =>  element.tokenAddress);
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairInformation');
        }
        return tokenAddresses;
    }

    static async getSwapPairsByTokenRoot(tokenRoot, offset = 0, limit = 100) {
        let pairs = [];
        try {
            pairs = (await SwapPairInformation.sequelize.query(`SELECT *
                                                                FROM swap_pair_information
                                                                WHERE token1_address = :tokenRoot
                                                                   OR token1_address = :tokenRoot
                                                                ORDER BY id DESC
                                                                LIMIT :limit OFFSET :offset`, {
                replacements: {tokenRoot, limit, offset}
            }))[0]
            // pairs = pairs.map((element) =>  element.tokenAddress);
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairInformation');
        }
        return pairs;
    }

    static async searchPairOrTokens(searcher, offset = 0, limit = 100) {
        let pairs = [];
        searcher = '%'+searcher+'%';

        try {
            pairs = (await SwapPairInformation.sequelize.query(`SELECT
                                                                    *
                                                                FROM
                                                                    swap_pair_information
                                                                WHERE
                                                                    swap_pair_address LIKE :searcher
                                                                   OR token1_address LIKE :searcher
                                                                   OR token2_address LIKE :searcher
                                                                   OR swap_pair_name LIKE :searcher
                                                                   OR lptoken_address LIKE :searcher`, {
                replacements: {searcher}
            }))[0]
            // pairs = pairs.map((element) =>  element.tokenAddress);
        } catch (err) {
            console.log(err);
            throw new DataBaseNotAvailable('SwapPairInformation');
        }
        return pairs;
    }
}


module.exports = SwapPairInformation;