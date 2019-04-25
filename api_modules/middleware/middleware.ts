import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

export default class Middleware {
    checkToken = (req, res, next) => {
        let token = req.headers['x-access-token'] || req.headers.authorization; // Express headers are auto converted to lowercase
       console.log(token);
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (!token) {
            return res.json({ error: true, sucess: false, data: { message: 'Auth token is not supplied.' } });
        }
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                return res.json({
                    error: true,
                    success: false,
                    data: {
                        message: 'Token is not valid or expired.'
                    }
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    }
}
