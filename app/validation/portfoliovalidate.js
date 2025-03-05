const Joi = require('joi')

const create_portfolio_validate = Joi.object({
  category_id: Joi.number().integer().required().messages({
    'number.base': 'category ID must be an integer.',
    'any.required': 'category ID is required.',
  }),
  
  product_name: Joi.string().min(1).max(100).required().messages({
    'string.base': 'product name must be a string.',
    'string.min': 'product name must be at least 1 characters.',
    'string.max': 'product name must be less than or equal to 100 characters.',
    'any.required': 'product name is required.',
  }),

  description : Joi.string().messages({
    'string.base': 'description must be a string.',
  }),

  image: Joi.string().messages({
    'string.base': 'image ID must be an string.',
  }),
});

const portfolio_id_check = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'id must be an integer.',
    'any.required': 'id is required.',
  }),
})


module.exports = { create_portfolio_validate, portfolio_id_check}