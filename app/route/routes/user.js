const express = require('express');
let route = express.Router();
const {auth} = require('../../middleware/auth')
const userRouter = require('../../controller/user.controller')

route.post('/registration', userRouter.registration)
route.post('/login', userRouter.login)
route.get('/getlistOfUser', userRouter.getListOfUser)
route.post('/viewProfile',auth, userRouter.viewProfile)
route.put('/updateprofile', userRouter.updateProfie)
route.put('/updatepassword', userRouter.updatePassword)
route.post('/verifyEmail', userRouter.verifyEmail)
route.post('/verifyotp', userRouter.verifyOTP)
route.put('/forgotpassword', userRouter.forgotPassword)

module.exports = route