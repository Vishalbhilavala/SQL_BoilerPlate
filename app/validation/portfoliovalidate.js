const Joi = require('joi')

const create_portfolio_validate = Joi.object({
  category_id: Joi.number().integer().empty().required().messages({
    'number.base': 'category ID must be an integer.',
    "number.empty": "category ID cannot be empty.",
    'any.required': 'category ID is required.',
  }),
  
  product_name: Joi.string().empty().required().messages({
    'string.base': 'product name must be a string.',
    "string.empty": "product name cannot be empty.",
    'any.required': 'product name is required.',
  }),

  description : Joi.string().empty().messages({
    'string.base': 'description must be a string.',
    "string.empty": "description cannot be empty.",
  }),

  image: Joi.string().empty().messages({
    'string.base': 'image ID must be an string.',
    "string.empty": "image cannot be empty.",
  }),
});

const portfolio_id_check = Joi.object({
  id: Joi.number().integer().empty().required().messages({
    'number.base': 'id must be an integer.',
    "number.empty": "id cannot be empty.",
    'any.required': 'id is required.',
  }),
})

const image_validate = Joi.object({
  image: Joi.object().empty().required().messages({
    'number.base': 'id must be an integer.',
    "number.empty": "id cannot be empty.",
    'any.required': 'id is required.',
  }),
})

module.exports = { create_portfolio_validate, portfolio_id_check}