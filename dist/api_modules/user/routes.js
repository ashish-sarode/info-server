"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const UserController_1 = require("./controllers/UserController");
const middleware_1 = require("../middleware/middleware");
const router = express.Router();
const user = new UserController_1.default();
const middleware = new middleware_1.default();
/*User controller routes*/
router.route('/login').post(user.login);
router.route('/count').get(user.count);
router.route('/get/:id').get(user.get);
router.route('/').post(middleware.checkToken, user.getAll);
router.route('/new').post(user.validateUserData, user.assignRole, user.insert);
router.route('/put/:id').put(middleware.checkToken, user.update);
router.route('/user/:id').delete(middleware.checkToken, user.delete);
exports.default = router;
//# sourceMappingURL=routes.js.map