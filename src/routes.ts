import * as express from 'express';
import baseRoutes from '../api_modules/base/routes'
import userRoutes from '../api_modules/user/routes';

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
        return res.status(err.code || 500).json({
            status: {
                isSuccessful: false,
                code: err.code || 500,
                message: err.info || 'Something went wrong.'
            },
            data: {
                errors: err
            }
        });
    });

}