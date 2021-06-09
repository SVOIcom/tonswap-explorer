//TODO: IMPORTANT: не забыть убрать данные подключения перед открытием репозитория
const config = {
    isSqllite: true,

    db: {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "1234",
        DB: "tonswap_explorer",
        dialect: "mysql",
        pool: {
            max: 15,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}


if (config.isSqllite) {
    const dbConf = config.db;
    dbConf.HOST = "localhost";
    dbConf.dialect = 'sqlite';
    dbConf.dialectOptions = {
        multipleStatements: true
    };
    dbConf.storage = './test_db.db';
}




Object.freeze(config);

module.exports = config;