import BaseController from './BaseController';
import userModel from '../models/UserModel';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

export default class UserController extends BaseController {
    model = userModel;

    login = (req, res) => {
        this.model.findOne({ email: req.body.email }, (err, user) => {

            if (!user) { return res.status(403).json({ error: true, sucess: false, data:{message: "User not register." }}); }
            user.comparePassword(req.body.password, (error, isMatch) => {
                if (!isMatch) {
                    return res.status(403).json({ error: true, sucess: false, data:{message: "Please check your credentials." }});
                }
                const token = jwt.sign({ user: user }, process.env.SECRET_TOKEN); // , { expiresIn: 10 } seconds
                req.headers['x-access-token'] = token;
                res.status(200).json({ error: false, sucess: true, data: { message:"Login success", token: token, user_name: user.username } });

            });
        });
    }
}
