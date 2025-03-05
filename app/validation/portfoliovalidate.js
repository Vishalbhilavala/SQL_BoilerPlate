const Joi = require('joi')

const create_portfolio_validate = Joi.object({
  category_id: Joi.number().integer().required().messages({
    'number.base': 'Category ID must be an integer.',
    'any.required': 'Category ID is required.',
  }),
  
  product_name: Joi.string().min(1).max(100).required().messages({
    'string.base': 'Product name must be a string.',
    'string.min': 'Product name must be at least 1 characters.',
    'string.max': 'Product name must be less than or equal to 100 characters.',
    'any.required': 'Product name is required.',
  }),

  description : Joi.string().messages({
    'string.base': 'Description must be a string.',
  }),

  image: Joi.string().messages({
    'string.base': 'Image ID must be an string.',
  }),
});

const portfolio_id_check = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'ID must be an integer.',
    'any.required': 'ID is required.',
  }),
})


module.exports = { create_portfolio_validate, portfolio_id_check}