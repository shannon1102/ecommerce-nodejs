const appRoot = require('app-root-path')
const winston = require('winston')
const format = winston.format
const moment = require('moment-timezone')
const util = require('util')

// define the custom settings for each transport (file, console)
var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
}


const myFormat = format.printf(info => {
    return `${info.timestamp} ${info.level}: ${util.inspect(info.message)}`
})

const appendTimestamp = format((info, opts) => {
    if (opts.tz)
        info.timestamp = moment()
            .tz(opts.tz)
            .format()
    return info
})

// instantiate a new Winston Logger with the settings defined above
var logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        appendTimestamp({tz: 'Asia/Ho_Chi_Minh'}),
        myFormat
    ),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        logger.info(message)
    }
}

module.exports = logger
