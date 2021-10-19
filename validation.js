const Joi = require('@hapi/joi');


const registerValidation = (data) => {
    // Validation Using Joi
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).min(6).required(),
        address: Joi.string().min(6).max(255).required()
    });
    return schema.validate(data);
};



const loginValidation = (data) => {
    // Validation Using Joi
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().max(255).min(6).required(),
    });
    return schema.validate(data);
};



module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;