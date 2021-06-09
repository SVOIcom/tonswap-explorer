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
        this._sequelize = new Sequelize(config.db.DB, config.db.USER, config.db.PASSWORD, dbOptions);
        this._models = {...models };

        for (let modelName in this._models)
            this._models[modelName].autoInitModel(this._sequelize);
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
        const x = await Database.init();
    }

    test();
}




module.exports = Database;