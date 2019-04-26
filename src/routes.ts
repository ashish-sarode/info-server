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

    router.use('/users', userRoutes);
    router.use('/', baseRoutes);

    app.use('/api/v1', router);

}