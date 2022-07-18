const Joi = require('@hapi/joi')

// Sauce validation
const sauceValidation = data => {
    const schema = Joi.object ({
        name: Joi.string()
            .min(3)
            .max(30)
            .pattern(new RegExp('^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$'))
            .required(),
        manufacturer: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$')),
        description: Joi.string()
            .required(),
        mainPepper: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$')),
        heat: Joi.number()
            .min(1)
            .max(10)
            .required(),
        userId: Joi.string()
            .required()
    })
    return schema.validate(data)
}

module.exports.sauceValidation = sauceValidation