const { Sequelize } = require("sequelize");
const config = require('../../config');
const models = require('../../models');
const _Model = require('../../models/_Model');

const dbOptions = {
    host: config.db.HOST,
    dialect: config.db.dialect,
    pool: config.db.pool
}


class Database {
    constructor() {
        this._sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, dbOptions);
        this._models = {...models};

        for (let model in this._models)
            model.autoInitModel(this._sequelize);
    }

    /**
     * @returns {Promise<Database>}
     */
    static async init() {
        const d = new Database();
        await d.sync();
        return d;
    }

    /**
     * @returns {Promise<Database>}
     */
    async sync() {
        await this.sequelize.sync();
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
    const x = await Database.init();
}




module.exports = Database;