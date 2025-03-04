const express = require('express');
let route = express.Router();

const CategoryRouter = require('../../controller/category.controller')

route.post('/categorycreate', CategoryRouter.CreateCategory)
route.get('/getlistofcategory', CategoryRouter.GetListOfCategory)
route.post('/updatecategory', CategoryRouter.UpdateCategory)
route.post('/deletecategory/:id', CategoryRouter.DeleteCategory)


module.exports = route
