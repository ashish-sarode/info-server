import * as express from 'express';
import UserController from './controllers/UserController'
import Middleware from '../middleware/middleware'


const router = express.Router();
const user = new UserController();
const middleware = new Middleware();

/*User controller routes*/
router.route('/login').post(user.login);
router.route('/count').get(user.count);
router.route('/get/:id').get(user.get);

router.route('/').post(middleware.checkToken, user.getAll);
router.route('/new').post(user.insert);
router.route('/put/:id').put(middleware.checkToken, user.update);
router.route('/user/:id').delete(middleware.checkToken, user.delete);

export default router;