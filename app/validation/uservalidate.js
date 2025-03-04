const Joi = require('joi')

const registration_validate = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.max': 'Name must be less than or equal to 30 characters.',
        'string.min': 'Name must be at least 3 characters.',
        'any.required': 'Name is required.'
      }),
    email: Joi.string().email().empty().required().messages({
            "string.base": "Email must be a string.",
            "string.empty": "Email cannot be empty.",
            "any.required": "Email is a required field.",
            "string.email": "Email must be a valid email address."
        }),
    password: Joi.string().min(4).empty().required().messages({
        'string.min': 'password must be 4 characters.',
        "string.base": "password must be a string.",
        "any.required": "password is a required field.",
        "string.empty": "password cannot be empty."
    })
})

const login_validate = Joi.object({
    email: Joi.string().email().empty().required().messages({
        "string.base": "Email must be a string.",
        "string.empty": "Email cannot be empty.",
        "any.required": "Email is a required field.",
        "string.email": "Email must be a valid email address."
    }),
    password: Joi.string().empty().required().messages({
        "string.base": "password must be a string.",
        "any.required": "password is a required field.",
        "string.empty": "password cannot be empty."
    })
})


const verifyotp_validate = Joi.object({
    email: Joi.string().email().empty().required().messages({
        'string.email': 'Invalid email format.',
        'string.empty': 'Password cannot be empty.',
        'any.required': 'Email is required.'
      }),
    otp: Joi.string().empty().required().min(6).message({
        'string.empty': 'OTP is required.',
        'string.min': 'OTP must be 6 characters.',
        'any.required': 'Email is required.'

    })
})
const forgotPassword_validate = Joi.object({
    newpassword: Joi.string().empty().min(4).required().messages({
        "string.base": "password must be a string.",
        'string.min': 'password must be 4 characters.',
        "any.required": "password is a required field.",
        "string.empty": "password cannot be empty."
    }),
    confirmpassword: Joi.string().empty().required().valid(Joi.ref("newpassword")).messages({
        "string.base": "password must be a string.",
        "any.only": "Password and confirm password must match.",
        "any.required": "password is a required field.",
        "string.empty": "password cannot be empty."
    }),
})
module.exports = {registration_validate, login_validate, verifyotp_validate, forgotPassword_validate}