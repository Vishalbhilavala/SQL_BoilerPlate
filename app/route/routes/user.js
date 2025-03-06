const express = require('express');
let route = express.Router();
const {auth} = require('../../middleware/auth')
const userRouter = require('../../controller/user.controller')

route.post('/registration', userRouter.registration)
route.post('/login', userRouter.login)
route.get('/getListOfUser', userRouter.getListOfUser)
route.post('/viewProfile',auth, userRouter.viewProfile)
route.put('/updateProfie', userRouter.updateProfie)
route.put('/updatePassword', userRouter.updatePassword)
route.post('/verifyEmail', userRouter.verifyEmail)
route.post('/verifyOTP', userRouter.verifyOTP)
route.put('/forgotPassword', userRouter.forgotPassword)

module.exports = route