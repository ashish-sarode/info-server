"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("../api_modules/base/routes");
const routes_2 = require("../api_modules/user/routes");
const logger_1 = require("../api_modules/middleware/logger");
const date = require("date-and-time");
const currentDate = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
/**
 *Function to setup application routes.
 * @export
 * @param {*} app
 */
function setRoutes(app) {
    const router = express.Router();
    router.use('/', routes_1.default);
    router.use('/users', routes_2.default);
    app.use('/api/v1', router, function (err, req, res, next) {
        logger_1.default.error(`${currentDate} : ${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.status(err.code || err.status || 500).json({
            status: {
                isSuccessful: false,
                code: err.code || err.status || 500,
                message: err.info || 'Something went wrong.'
            },
            data: {
                errors: err
            }
        });
    });
}
exports.default = setRoutes;
//# sourceMappingURL=routes.js.map