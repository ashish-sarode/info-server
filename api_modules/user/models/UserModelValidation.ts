import * as Joi from '@hapi/joi';

const userSchemaValidation = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    isActive: Joi.boolean(),
    role: Joi.string().alphanum(),

});
export default userSchemaValidation;