const Joy = require('joi')

const create_category_validate = Joy.object({
    category_name: Joy.string().required().empty().messages({
        "string.base": "Category Name must be a string.",
        "string.empty": "Category Name cannot be empty.",
        "any.required": "Category Name is a required field.",
    })
})

module.exports = { create_category_validate, }