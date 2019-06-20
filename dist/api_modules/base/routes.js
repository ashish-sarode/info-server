"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
/**
 * Default Routes
 * */
router.get('/', function (req, res) {
    res.send('Welcome to info-server API\'s');
});
exports.default = router;
//# sourceMappingURL=routes.js.map