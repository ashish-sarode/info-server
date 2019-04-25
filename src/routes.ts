import * as express from 'express';
import UserController from '../api_modules/controllers/UserController'
import Middleware from '../api_modules/middleware/middleware'

export default function setRoutes(app) {
    const router = express.Router();
    const user = new UserController();
    const middleware = new Middleware();
    /*default route*/
    router.route('/').get(function (req, res) {
        res.send('Welcome to info-server API\'s')
    })

    /*User controller routes*/
    router.route('/login').post(user.login);
    router.route('/users').get(middleware.checkToken, user.getAll);
    router.route('/users/count').get(user.count);
    router.route('/user').post(user.insert);
    router.route('/user/:id').get(user.get);
    router.route('/user/:id').put(user.update);
    router.route('/user/:id').delete(user.delete);
    app.use('/api/v1', router);

}