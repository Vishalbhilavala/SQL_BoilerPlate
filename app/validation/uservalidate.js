const Joi = require('joi')

const registration_validate = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.max': 'name must be less than or equal to 30 characters.',
        'string.min': 'name must be at least 3 characters.',
        'any.required': 'name is required.'
      }),

    email: Joi.string().email().empty().required().messages({
            "string.base": "email must be a string.",
            "string.empty": "email cannot be empty.",
            "any.required": "email is a required.",
            "string.email": "email must be a valid email address."
        }),

    password: Joi.string().min(4).empty().required().messages({
        'string.min': 'password must be 4 characters.',
        "string.base": "password must be a string.",
        "any.required": "password is a required.",
        "string.empty": "password cannot be empty."
    })
})

const login_validate = Joi.object({
    email: Joi.string().email().empty().required().messages({
        "string.base": "email must be a string.",
        "string.empty": "email cannot be empty.",
        "any.required": "email is a required.",
        "string.email": "email must be a valid email address."
    }),
    password: Joi.string().empty().required().messages({
        "string.base": "password must be a string.",
        "any.required": "password is a required.",
        "string.empty": "password cannot be empty.",
    })
})

const update_validate = Joi.object({
    id: Joi.number().integer().required().messages({
        'number.base': 'category ID must be an integer.',
        'any.required': 'category ID is required.',
      }),

    name: Joi.string().min(3).max(30).messages({
        'string.max': 'name must be less than or equal to 30 characters.',
        'string.min': 'name must be at least 3 characters.',
      }),

    email: Joi.string().email().messages({
            "string.base": "email must be a string.",
            "string.email": "email must be a valid email address."
        }),
})

const verifyotp_validate = Joi.object({
    email: Joi.string().email().empty().required().messages({
        'string.email': 'invalid email format.',
        'string.empty': 'password cannot be empty.',
        'any.required': 'email is required.'
      }),
    otp: Joi.string().empty().required().min(6).message({
        'string.empty': 'OTP is required.',
        'string.min': 'OTP must be 6 characters.',
        'any.required': 'email is required.'

    })
})
const forgotPassword_validate = Joi.object({
    newpassword: Joi.string().empty().min(4).required().messages({
        "string.base": "newpassword must be a string.",
        'string.min': 'newpassword must be 4 characters.',
        "any.required": "newpassword is a required field.",
        "string.empty": "newpassword cannot be empty."
    }),
    confirmpassword: Joi.string().empty().required().valid(Joi.ref("newpassword")).messages({
        "string.base": "confirmpassword must be a string.",
        "any.only": "new password and confirm password must match.",
        "any.required": "confirmpassword is a required field.",
        "string.empty": "confirmpassword cannot be empty."
    }),
})

module.exports = {registration_validate, login_validate, verifyotp_validate, forgotPassword_validate, update_validate}