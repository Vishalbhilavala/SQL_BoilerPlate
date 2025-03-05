const express = require('express');
let route = express.Router();

const categoryRouter = require('../../controller/category.controller')

route.post('/categoryCreate', categoryRouter.createCategory)
route.get('/getListOfCategory', categoryRouter.getListOfCategory)
route.post('/viewCategory/:id', categoryRouter.viewCategory)
route.put('/updateCategory', categoryRouter.updateCategory)
route.delete('/deleteCategory/:id', categoryRouter.deleteCategory)


module.exports = route
