const express = require('express');
let route = express.Router();

const categoryRouter = require('../../controller/category.controller')

route.post('/categorycreate', categoryRouter.createCategory)
route.get('/getlistofcategory', categoryRouter.getListOfCategory)
route.post('/viewcategory/:id', categoryRouter.viewCategory)
route.put('/updatecategory', categoryRouter.updateCategory)
route.delete('/deletecategory/:id', categoryRouter.deleteCategory)


module.exports = route
