const { Sequelize } = require("sequelize");
const config = require('../../config');
const models = require('../../models');
const _Model = require('../../models/_Model');

const dbOptions = {
    host: config.db.HOST,
    dialect: config.db.dialect,
    pool: config.db.pool,
    storage: config.db.storage,
}


class Database {
    constructor() {
        // TODO: обработка моделей не унаследованных от _Model
        this._sequelize = new Sequelize(config.db.DB, config.db.USER, config.db.PASSWORD, dbOptions);
        this._models = {...models };

        for (let modelName in this._models) {
            if (this._models[modelName].autoInitModel)
                this._models[modelName].autoInitModel(this._sequelize);
        }
    }

    /**
     * @returns {Promise<Database>}
     */
    static async init() {
        const database = new Database();
        await database.sync();
        return database;
    }

    /**
     * @returns {Promise<Database>}
     */
    async sync() {
        await this.sequelize.sync();
    }

    async close() {
        await this._sequelize.close();
    }

    static get Sequelize() {
        return Sequelize;
    }

    /**
     * @property
     * @returns {Sequelize}
     */
    get sequelize() {
        return this._sequelize;
    }


    /**
     * @property
     * @returns {Record<any, _Model>} - All project models
     */
    get models() {
        return this._models;
    }
}




if (require.main === module) {
    async function test() {
        const db = await Database.init();
        // const pairs = ['0:446a35dcf34675c9f77ce951af92ddb643bdaaa190277dc4f752dca142f61d3e', '0:12987e0102acf7ebfe916da94a1308540b9894b3b99f8d5c7043a39725c08bdf'];
        const pairs = ['0:12987e0102acf7ebfe916da94a1308540b9894b3b99f8d5c7043a39725c08bdf'];

        console.log((await models.SwapEvents.getRecentDaysStats('0:2bafdadbff85eb381a980f8162afbc1004f5a17941db2f3ee1d7eea29c7587f8')));
    }

    test();
}




module.exports = Database;