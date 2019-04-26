import * as express from 'express';
import UserController from './controllers/UserController'
import Middleware from '../middleware/middleware'


const router = express.Router();
const user = new UserController();
const middleware = new Middleware();

/*User controller routes*/
router.route('/login').post(user.login);
router.route('/').get(middleware.checkToken, user.getAll);
router.route('/count').get(user.count);
router.route('/new').post(user.insert);
router.route('/get/:id').get(user.get);
router.route('/put/:id').put(user.update);
router.route('/user/:id').delete(user.delete);

export default router;