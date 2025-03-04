const jwt = require('jsonwebtoken')
const message = require('../utils/message')
require('dotenv').config()

const auth = (req, res, next) =>{
    const token = req.header('token')

    if(!token){
        return res.status(404).send({success: false, message:message.DATA_NOT_FOUND})
    }

    const Jwt_Secret = process.env.JWT_SECRET

    try {
        const valid = jwt.verify(token, Jwt_Secret)
        req.user_data = valid    
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send({success: false, message:'Token not valid'})
    }
}

module.exports = {auth}