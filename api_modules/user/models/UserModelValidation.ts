import * as Joi from '@hapi/joi';

const userSchemaValidation = Joi.object().keys({
    username: Joi.string().min(3).max(30).required().label('Full Name'),
    email: Joi.string().email({ minDomainSegments: 2 }),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    isActive: Joi.boolean(),
    role: Joi.string().alphanum(),
    deviceId: Joi.string().allow('', null),
    fcmToken: Joi.string().allow('', null),
    device: Joi.string().allow('').valid('Android', 'IOS','Web'),

});
export default userSchemaValidation;