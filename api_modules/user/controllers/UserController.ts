import BaseController from '../../base/controllers/BaseController';
import userModel from '../models/UserModel';
import userRoleModel from '../models/UserRoleModel';
import Middleware from '../../middleware/middleware'
import * as jwt from 'jsonwebtoken';

const middleware = new Middleware();

/**
 * Controller class for user operations.
 *
 * @export
 * @class UserController
 * @extends {BaseController}
 */
export default class UserController extends BaseController {
    model = userModel;
    private token: any;
    /**
     * Function to authenticate user by user email and password
     *
     * @memberof UserController
     */
    login = (req, res, next) => {
        try {
            this.model.findOne({ email: req.body.email }, (err, user) => {
                if (!user) { return res.status(403).json(this.filterResponse(false, 403, 'User not register.', {})); }
                user.comparePassword(req.body.password, (error, isMatch) => {
                    if (!isMatch) {
                        return res.status(403).json(this.filterResponse(false, 403, 'Please check your login details.', {}));
                    }
                    this.token = jwt.sign({ user: user }, process.env.SECRET_TOKEN, { expiresIn: 60 * 60 }); // , { expiresIn: 10 } seconds
                    req.headers['x-access-token'] = this.token;
                    res.status(200).json(this.filterResponse(true, 200, 'Login Success!', { token: this.token, username: user.username, _id: user._id }));
                });
            });
        } catch (ex) {
            return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
        }
    }

    /**
     * Function to validate role and assign to newly creating user
     *
     * @memberof UserController
     */
    assignRole = (req, res, next) => {
        try {
            userRoleModel.findOne({ role: req.body.role }, (err, userRole) => {
                if (!userRole) { return res.status(403).json(this.filterResponse(false, 403, 'Invalid user role.', {})); }
               // req.body.role = userRole._id;
                next()
            });
        } catch (ex) {
            return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
        }
    }
}
