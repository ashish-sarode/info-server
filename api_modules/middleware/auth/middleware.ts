import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import userModel from '../../user/models/UserModel';
const authConfig = require('../../middleware/auth/auth-config');

export default class Middleware {
    private token: any;
    private refreshToken: any;

    signIn = (user) => {
        authConfig.secret = process.env.SECRET_TOKEN;

        this.token = jwt.sign({ user: user }, authConfig.secret, { expiresIn: authConfig.tokenLife }); // , { expiresIn: 10 } seconds
        this.refreshToken = jwt.sign({ user: user }, authConfig.secret, { expiresIn: authConfig.refreshTokenLife });

        return { token: this.token, refreshToken: this.refreshToken };
    }



    /**
     * Function to validate auth token provided by client
     * @param req Request
     * @param res Request
     * @param next Callback
     * @memberof Middleware
     */
    checkToken = async (req, res, next) => {
        try {
            var token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase

            if (!token) {
                return next(this.customErrorHandler(400, 'InvalidParams', 'Bad Request.', 'Auth token is not supplied.'));
            }
            token = (token.startsWith('Bearer ')) ? token.slice(7, token.length) : token;

            req.decoded = await jwt.verify(token, process.env.SECRET_TOKEN);

            var user = await userModel.findOne({ email: req.decoded.user.email });
            if (!user.isActive) {
                return next(this.customErrorHandler(403, 'UserStateError', 'Unauthorized access.', 'You might not be no longer authorized. Please contact administrator.'));
            }
            next();

        } catch (ex) {
            if (ex.name == 'TokenExpiredError' || ex.name == 'JsonWebTokenError') {
                ex.code = 401;
                ex.info = 'Unauthorized access.';
                ex.message = 'Token is not valid or expired.'
                return next(ex);
            }
            return next(this.customErrorHandler(500, ex.name, 'Something went wrong.', ex.message));
        }
    }

    /**
     * Function to display customized errors
     * @param code Status Code
     * @param name Error Type
     * @param info Error Information
     * @param message Error Message
     * @memberof Middleware
     */
    customErrorHandler = (code, name, info, message) => {
        let err: any = new Error();
        err.code = code;
        err.info = info
        err.message = message
        err.name = name;
        return err;
    }
}
