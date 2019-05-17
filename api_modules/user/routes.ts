import * as express from 'express';
import UserController from './controllers/UserController'
import Middleware from '../middleware/auth/middleware'


const router = express.Router();
const user = new UserController();
const middleware = new Middleware();

/*User controller routes*/
router.route('/login').post(user.login);
router.route('/token').post(user.getToken);
router.route('/count').get(user.count);
router.route('/get/:id').get(user.get);

router.route('/').post(middleware.checkToken, user.getAll);
router.route('/new').post(user.validateUserData, user.assignRole, user.insert);
router.route('/put/:id').put(middleware.checkToken, user.update);
router.route('/user/:id').delete(middleware.checkToken, user.delete);

export default router;