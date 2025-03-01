const express = require('express');
let route = express.Router();
const {auth} = require('../../middleware/auth')
let {register, login, UsersData, ViewuserById, ViewByPagination, ResetPasswordViaEmail, Sent_Otp} = require('../../controller/user.controller')

route.get('/alldata', UsersData)
route.get('/data/',auth, ViewuserById)
route.post('/pagination', ViewByPagination)
route.post('/register', register)
route.post('/login', login)
route.post('/sent-otp',auth, Sent_Otp)
route.post('/setpassword', auth, ResetPasswordViaEmail)

module.exports = route