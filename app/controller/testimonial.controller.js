const db = require('../middleware/database');
const logger = require('../services/logger');
const { GeneralError, BadRequest } = require('../utils/error');
const responseStatus = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const message = require('../utils/message');
const { GeneralResponse } = require('../utils/responce');
const { create_testimonial_validate } = require('../validation/testimonialvalidate ');

module.exports = {
    createTestimonial : async (req, res) => {
        try {
            let { client_name, image_description, image } = req.body;
            
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
              statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
              status: responseStatus.RESPONSE_ERROR,
              error: error,
            });
        }
    }
}