"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = require("../../base/controllers/BaseController");
const UserModel_1 = require("../models/UserModel");
const UserRoleModel_1 = require("../models/UserRoleModel");
const UserModelValidation_1 = require("../models/UserModelValidation");
const middleware_1 = require("../../middleware/middleware");
const jwt = require("jsonwebtoken");
const middleware = new middleware_1.default();
/**
 * Controller class for user operations.
 *
 * @export
 * @class UserController
 * @extends {BaseController}
 */
class UserController extends BaseController_1.default {
    /**
     *Creates an instance of UserController.
     * @memberof UserController
     */
    constructor() {
        super();
        this.model = UserModel_1.default;
        this.schemaValidation = UserModelValidation_1.default;
        /**
         * Function to authenticate user by user email and password
         *
         * @memberof UserController
         */
        this.login = (req, res, next) => {
            try {
                this.model.findOne({ email: req.body.email }, (err, user) => {
                    if (!user) {
                        return res.status(403).json(this.filterResponse(false, 403, 'User not register.', {}));
                    }
                    user.comparePassword(req.body.password, (error, isMatch) => {
                        if (!isMatch) {
                            return res.status(403).json(this.filterResponse(false, 403, 'Please check your login details.', {}));
                        }
                        this.token = jwt.sign({ user: user }, process.env.SECRET_TOKEN, { expiresIn: 60 * 60 }); // , { expiresIn: 10 } seconds
                        req.headers['x-access-token'] = this.token;
                        res.status(200).json(this.filterResponse(true, 200, 'Login Success!', { token: this.token, username: user.username, _id: user._id }));
                    });
                });
            }
            catch (ex) {
                return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
            }
        };
        /**
         * Function to validate role and assign to newly creating user
         *
         * @memberof UserController
         */
        this.assignRole = (req, res, next) => {
            try {
                UserRoleModel_1.default.findOne({ role: req.body.role }, (err, userRole) => {
                    if (!userRole) {
                        return res.status(403).json(this.filterResponse(false, 403, 'Invalid user role.', {}));
                    }
                    req.body.role = userRole._id;
                    next();
                });
            }
            catch (ex) {
                return next(middleware.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
            }
        };
        this.dataPopulation = { path: 'role', match: { isActive: true }, select: 'role -_id' };
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map