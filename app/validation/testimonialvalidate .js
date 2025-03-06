const Joi = require('joi')

const create_testimonial_validate = Joi.object({
    client_name: Joi.string().required().messages({
      'string.base': 'client name must be a string.',
      'any.required': 'client name is required.',
    }),
  
    image_description : Joi.string().messages({
      'string.base': 'description must be a string.',
    })

})

module.exports = { create_testimonial_validate}