const express = require('express');
let route = express.Router();
let {register, login, UsersData, ViewuserById, ViewByPagination, Sorting} = require('../../controller/user.controller')

route.get('/data', UsersData)
route.get('/data/:id', ViewuserById)
route.post('/pagination', ViewByPagination)
route.post('/register', register)
route.post('/login', login)

module.exports = route