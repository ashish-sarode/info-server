import BaseController from '../../base/controllers/BaseController';
import userModel from '../models/UserModel';
import userRoleModel from '../models/UserRoleModel';
import userSchemaValidation from '../models/UserModelValidation';
import Middleware from '../../middleware/auth/middleware'
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
    schemaValidation = userSchemaValidation;
    private tokens: any;

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
            console.log("hello - login");
            this.model.findOne({ email: req.body.email }, (err, user) => {
                if (!user) { return res.status(403).json(this.filterResponse(false, 403, 'User not register.', {})); }
                user.comparePassword(req.body.password, (error, isMatch) => {
                    if (!isMatch) {
                        return res.status(403).json(this.filterResponse(false, 403, 'Please check your login details.', { errors: { name: 'AuthenticationError', message: "Invalid login credentials." } }));
                    }
                    this.tokens = middleware.signIn(user);
                    //req.headers['x-access-token'] = tokens.token;
                    res.status(200).json(this.filterResponse(true, 200, 'Login Success!', { tokens: this.tokens, user: { username: user.username, email: user.email } }));
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

    /**
     * Function to authenticate user by user email and password
     *
     * @memberof UserController
     */
    getToken = async (req, res, next) => {
        try {
            const userEmail = req.body.email;
            const refreshToken = (req.body.refreshToken.startsWith('Bearer ')) ? req.body.refreshToken.slice(7, req.body.refreshToken.length) : req.body.refreshToken;

            const decoded = await jwt.verify(refreshToken, process.env.SECRET_TOKEN);
            req.body = decoded.user;
            if ((req.body.email != userEmail)) { return res.status(403).json(this.filterResponse(false, 403, 'User not register.', {})); }

            this.model.findOne({ email: req.body.email }, (err, user) => {
                if (err) { return next(err); }
                if (!user.isActive) { return next(middleware.customErrorHandler(403, 'UserStateError', 'Unauthorized access.', 'You might not be no longer authorized. Please contact administrator.')); }
                this.tokens = middleware.signIn(user);
                //req.headers['x-access-token'] = this.token;
                res.status(200).json(this.filterResponse(true, 200, 'Token regenerated!', { tokens: this.tokens, user: { username: user.username, email: user.email } }));
            });
        } catch (ex) {
            if (ex.name == 'TokenExpiredError' || ex.name == 'JsonWebTokenError') {
                ex.code = 401;
                ex.info = 'Unauthorized access.';
                ex.message = 'Token is not valid or expired.'
                return next(ex);
            }
            return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
        }
    }

}
