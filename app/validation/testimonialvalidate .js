const Joi = require('joi')

const create_testimonial_validate = Joi.object({
    client_name: Joi.string().empty().required().messages({
      'string.base': 'client name must be a string.',
      "string.empty": "client name cannot be empty.",
      'any.required': 'client name is required.',
    }),
  
    image_description : Joi.string().empty().messages({
      'string.base': 'description must be a string.',
      "string.empty": "image description cannot be empty.",
    })

})

module.exports = { create_testimonial_validate}