'use strict'

const env = process.env.NODE_ENV || 'development' // dev or prod

const development = {
    dbSettings: {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: process.env.SQL_DBNAME,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    serverSettings: {
        port: process.env.PORT || 5000
    },
    orderTypeSetting: {
        ASC:1,
        DESC:2
    },

}

const production = {
    dbSettings: {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: process.env.SQL_DBNAME,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    serverSettings: {
        port: process.env.PORT
    },
    orderTypeSetting: {
        ASC:1,
        DESC:2
    },

}


const config = {
    development,
    production
}

module.exports = Object.assign({}, config[env])