import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

export default class Middleware {
    /**
     * Function to validate auth token provided by client
     * @param req Request
     * @param res Request
     * @param next Callback
     * @memberof Middleware
     */
    checkToken = (req, res, next) => {
        try {
            var token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            if (!token) {
                return next(this.customErrorHandler(400, 'InvalidParams', 'Bad Request.', 'Auth token is not supplied.'));
            }
            jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                if (err) {
                    err.code = 401;
                    err.info = 'Unauthorized access.';
                    err.message = 'Token is not valid or expired.'
                    return next(err);

                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } catch (ex) {
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
