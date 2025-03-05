const Joi = require('joi')

const create_portfolio_validate = Joi.object({
  category_id: Joi.number().integer().required().messages({
    'number.base': 'category ID must be an integer.',
    'any.required': 'category ID is required.',
  }),
  
  product_name: Joi.string().required().messages({
    'string.base': 'product name must be a string.',
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