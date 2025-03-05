const express = require('express');
let route = express.Router();

const CategoryRouter = require('../../controller/category.controller')

route.post('/categorycreate', CategoryRouter.createCategory)
route.get('/getlistofcategory', CategoryRouter.getListOfCategory)
route.put('/updatecategory', CategoryRouter.updateCategory)
route.delete('/deletecategory/:id', CategoryRouter.deleteCategory)


module.exports = route
