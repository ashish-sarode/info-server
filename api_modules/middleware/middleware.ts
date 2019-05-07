import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

export default class Middleware {
    checkToken = (req, res, next) => {
        try {
            let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
            if (token.startsWith('Bearer ')) {
                // Remove Bearer from string
                token = token.slice(7, token.length);
            }

            if (!token) {
                return res.json({
                    status: {
                        isSuccessful: false,
                        code: 400,
                        message: 'Bad request.'
                    },
                    data: {
                        errors: {
                            authorization: 'Auth token is not supplied.'
                        }
                    }
                });
            }
            jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                if (err) {
                    return res.json({
                        status: {
                            isSuccessful: false,
                            code: 401,
                            message: 'Unauthorized access.'
                        },
                        data: {
                            errors: {
                                authorization: 'Token is not valid or expired.'
                            }
                        }
                    });

                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } catch (ex) {
            return res.json({
                status: {
                    isSuccessful: false,
                    code: 400,
                    message: 'Bad request.'
                },
                data: {
                    errors: {message:'Something went wrong.'}
                }
            });
        }
    }
}
