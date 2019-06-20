"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appRoot = require("app-root-path");
const date = require("date-and-time");
const winston = require('winston');
const currentDate = date.format(new Date(), 'YYYY-MM-DD');
var options = {
    file: {
        level: 'error',
        filename: `${appRoot}/logs/app-${currentDate}.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
var logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false,
});
logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map