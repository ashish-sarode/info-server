import * as express from 'express';
import baseRoutes from '../api_modules/base/routes'
import userRoutes from '../api_modules/user/routes';
import logger from '../api_modules/middleware/logger/logger'
import * as date from 'date-and-time';
import * as TableFormatter from 'cli-table';
const currentDate = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

/**
 *Function to setup application routes.
 * @export
 * @param {*} app
 */
export default function setRoutes(app) {
    const router = express.Router();

    router.use('/', baseRoutes);
    router.use('/users', userRoutes);

    app.use('/api/v1', router, function (err, req, res, next) {
        logger.error(`${currentDate} : ${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        const table = new TableFormatter({
            head: ['Date-Time', 'URL/IP', 'Method', 'Status', 'Message']
        });
        /* table.push(
             { 'Date-Time': currentDate }
           , { 'URL': req.originalUrl }
         );*/
        table.push(
            [currentDate, `${req.originalUrl} - ${req.ip}`, req.method, err.code || err.status || 500, err.message]
        );

        console.log(table.toString());
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