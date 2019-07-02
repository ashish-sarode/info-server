"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const userSchemaValidation = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    isActive: Joi.boolean(),
    role: Joi.string().alphanum(),
});
exports.default = userSchemaValidation;
//# sourceMappingURL=UserModelValidation.js.map