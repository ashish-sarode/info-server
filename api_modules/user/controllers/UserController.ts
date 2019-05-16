import BaseController from '../../base/controllers/BaseController';
import userModel from '../models/UserModel';
import userRoleModel from '../models/UserRoleModel';
import userSchemaValidation from '../models/UserModelValidation';
import Middleware from '../../middleware/auth/middleware'
import * as jwt from 'jsonwebtoken';

const authConfig = require('../../middleware/auth/auth-config');
const middleware = new Middleware();

/**
 * Controller class for user operations.
 *
 * @export
 * @class UserController
 * @extends {BaseController}
 */
export default class UserController extends BaseController {
    private token: any;
    private refreshToken: any;
    model = userModel;
    schemaValidation = userSchemaValidation;

    /**
     *Creates an instance of UserController.
     * @memberof UserController
     */
    constructor() {
        super();
        this.dataPopulation = { path: 'role', match: { isActive: true }, select: 'role -_id' };
    }

    /**
     * Function to authenticate user by user email and password
     *
     * @memberof UserController
     */
    login = (req, res, next) => {
        try {
            authConfig.secret = process.env.SECRET_TOKEN;
            console.log(authConfig);
            this.model.findOne({ email: req.body.email }, (err, user) => {
                if (!user) { return res.status(403).json(this.filterResponse(false, 403, 'User not register.', {})); }
                user.comparePassword(req.body.password, (error, isMatch) => {
                    if (!isMatch) {
                        return res.status(403).json(this.filterResponse(false, 403, 'Please check your login details.', { errors: { name: 'AuthenticationError', message: "Invalid login credentials." } }));
                    }
                    this.token = jwt.sign({ user: user }, authConfig.secret, { expiresIn: authConfig.tokenLife }); // , { expiresIn: 10 } seconds
                    this.refreshToken = jwt.sign({ user: user }, authConfig.secret, { expiresIn: authConfig.refreshTokenLife });
                    req.headers['x-access-token'] = this.token;
                    res.status(200).json(this.filterResponse(true, 200, 'Login Success!', { tokens: { token: this.token, refreshToken: this.refreshToken }, user: { username: user.username, email: user.email } }));
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
                req.body.role = userRole._id;
                next()
            });
        } catch (ex) {
            return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
        }
    }

}
