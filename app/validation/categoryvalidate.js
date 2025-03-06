const Joy = require('joi')

const create_category_validate = Joy.object({
    category_name: Joy.string().required().empty().messages({
        "string.base": "category name must be a string.",
        "string.empty": "category name cannot be empty.",
        "any.required": "category name is a required field.",
    })
})

module.exports = { create_category_validate, }