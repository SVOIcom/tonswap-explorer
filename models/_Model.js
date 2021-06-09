const { Model, DataTypes } = require('sequelize');


const CustomTypes = Object.freeze({
    ID:          DataTypes.INTEGER(10),
    TIMESTAMP:   DataTypes.BIGINT(20),
    NUMBER:      DataTypes.DOUBLE(),
    TON_ADDRESS: DataTypes.STRING(66),
    TON_TX:      DataTypes.STRING(64),
});

const DT = Object.freeze({...DataTypes });



class ModelTemplate extends Model {
    static get Types() {
        return DT;
    };

    static get CustomTypes() {
        return CustomTypes;
    }

    /**
     * @property
     * @returns {String}
     */
    static get _tableName() {
        throw new Error('Table name required');
    }

    /**
     * @property
     * @returns {object}
     */
    static get _tableFields() {
        throw new Error('Table fields required');
    }

    /**
     * @property
     * @returns {object}
     */
    static get _tableOptions() {
        return {};
    }

    /**
     * 
     * @param {*} sequelize - sequelize instance
     * @returns {ModelTemplate}
     */
    static autoInitModel(sequelize) {
        if (!sequelize)
            throw new Error('Sequelize object requred');

        return this.init(this._tableFields, {...this._tableOptions, sequelize: sequelize, modelName: this._tableName });
    }
}


module.exports = ModelTemplate;