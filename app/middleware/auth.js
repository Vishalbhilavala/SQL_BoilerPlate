const jwt = require('jsonwebtoken')
const message = require('../utils/message')
const logger = require('../services/logger')
const {StatusCodes} = require('http-status-codes')
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
        logger.error(error)
        return res
          .status(200)
          .json({
            statusCode: StatusCodes.UNAUTHORIZED,
            status: responseStatus.RESPONSE_ERROR,
            error: error,
          });
    }
}

module.exports = {auth}