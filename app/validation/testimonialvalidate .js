const Joi = require('joi')

const create_testimonial_validate = Joi.object({
    client_name: Joi.string().empty().required().messages({
      'string.base': 'client name must be a string.',
      "string.empty": "client name cannot be empty.",
      'any.required': 'client name is required.',
    }),
  
    description : Joi.string().empty().messages({
      'string.base': 'description must be a string.',
      "string.empty": "image description cannot be empty.",
    }),
    image: Joi.string().empty().messages({
        'string.base': 'image path must be an string.',
        "string.empty": "image cannot be empty.",
      }),
})

const Testimonial_valid = Joi.object({
  id: Joi.number().integer().empty().required().messages({
    'number.base': 'id must be an integer.',
    "number.empty": "id cannot be empty.",
    'any.required': 'id is required.',
  }),
  client_name: Joi.string().empty().messages({
    'string.base': 'client name must be a string.',
    "string.empty": "client name cannot be empty.",
  }),

  description : Joi.string().empty().messages({
    'string.base': 'description must be a string.',
    "string.empty": "image description cannot be empty.",
  }),
})

module.exports = { create_testimonial_validate, Testimonial_valid}