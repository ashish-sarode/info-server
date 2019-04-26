import BaseController from '../../base/controllers/BaseController';
import userModel from '../models/UserModel';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

/**
 * Controller class for user operations.
 *
 * @export
 * @class UserController
 * @extends {BaseController}
 */
export default class UserController extends BaseController {
    model = userModel;
    /**
     *Function to authenticate user by user email and password
     *
     * @memberof UserController
     */
    login = (req, res) => {
        this.model.findOne({ email: req.body.email }, (err, user) => {

            if (!user) { return res.status(403).json(this.filterResponse(false, 403, 'User not register.', {})); }
            user.comparePassword(req.body.password, (error, isMatch) => {
                if (!isMatch) {
                    return res.status(403).json(this.filterResponse(false, 403, 'Please check your login details.', {}));
                }
                const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN, { expiresIn: 60 * 60 }); // , { expiresIn: 10 } seconds
                req.headers['x-access-token'] = token;
                let data = { token: token, user_name: user.username, user_id: user._id };
                res.status(200).json(this.filterResponse(true, 200, 'Login Success!', data));

            });
        });
    }
}
