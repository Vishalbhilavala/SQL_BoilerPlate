const db = require('../middleware/database');
const logger = require('../services/logger');
const { GeneralError, BadRequest } = require('../utils/error');
const responseStatus = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const message = require('../utils/message');
const { GeneralResponse } = require('../utils/responce');
const {
  create_testimonial_validate,
  Testimonial_valid,
} = require('../validation/testimonialvalidate ');
const { cli } = require('winston/lib/winston/config');

module.exports = {
  createTestimonial: async (req, res) => {
    try {
      let { client_name, description, image } = req.body;
      const { error } = create_testimonial_validate.validate(req.body);

      if (error) {
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }
      const [testimonial] = await db.query(
        'INSERT INTO testimonial(client_name, description) VALUES(?, ?)',
        [client_name, description]
      );

      const testimonial_id = testimonial.insertId;

      if (image) {
        await db.query(
          'INSERT INTO imagies(testimonial_id, image_path) VALUES(?, ?)',
          [testimonial_id, image]
        );
      }

      logger.info(`Testimonial data ${message.ADD_SUCCESS}`);
      return res.status(200).json({
        statusCode: StatusCodes.CREATED,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Testimonial ${message.ADD_SUCCESS}`,
        testimonial: testimonial_id
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error,
      });
    }
  },

  getListOfTestimonial: async (req, res) => {
    try {
      let { page, data, sortBy, orderBy = 'asc', search } = req.body;
      const [testimonial] = await db.query(
        'SELECT testimonial.*, imagies.image_path FROM testimonial LEFT JOIN imagies ON testimonial.id = imagies.testimonial_id'
      );

      if (testimonial.length === 0) {
        logger.log(`Testimonial ${message.NOT_FOUND}`);
        return res.status(200).json({
          status: responseStatus.RESPONSE_ERROR,
          statusCode: StatusCodes.NOT_FOUND,
          message: `Testimonial ${message.NOT_FOUND}`,
        });
      }

      let filteredTestimonial = testimonial;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredTestimonial = testimonial.filter((testimonial) =>
          testimonial.client_name.toLowerCase().includes(searchLower)
        );
      }

      if (sortBy && filteredTestimonial.length > 0) {
        filteredTestimonial.sort((a, b) => {
          if (orderBy === 'desc') {
            return b[sortBy] > a[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          }
        });
      }

      let StartIndex = (page - 1) * data;
      let EndIndex = StartIndex + data;

      const show = filteredTestimonial.slice(StartIndex, EndIndex);

      logger.info(show);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        Testimonial: show,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error,
      });
    }
  },

  viewTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      const [testimonial] = await db.query(
        'SELECT testimonial.*, imagies.image_path FROM testimonial LEFT JOIN imagies ON testimonial.id = imagies.testimonial_id WHERE testimonial.id = ? ',
        [id]
      );

      if (testimonial.length === 0) {
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.status(200).json({
          status: responseStatus.RESPONSE_ERROR,
          statusCode: StatusCodes.NOT_FOUND,
          message: `Testimonial ${message.NOT_FOUND}`,
        });
      }

      logger.info(testimonial);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        testimonial,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error,
      });
    }
  },

  updateTestimonial: async (req, res) => {
    try {
      const { id, client_name, description } = req.body;
      const { error } = Testimonial_valid.validate(req.body);

      if (error) {
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [testimonial] = await db.query(
        'SELECT * FROM testimonial WHERE id = ? ',
        [id]
      );

      if (testimonial.length === 0) {
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Testimonial ${message.NOT_FOUND}`,
        });
      }

      if (client_name) {
        await db.query('UPDATE testimonial SET client_name = ? WHERE id = ?', [
          client_name,
          id,
        ]);
      }

      if (description) {
        await db.query(
          'UPDATE testimonial SET description = ? WHERE id = ?',
          [description, id]
        );
      }

      logger.info(`Testimonial ${(message.UPDATED_SUCCESS, testimonial)}`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Testimonial ${message.UPDATED_SUCCESS}`,
        testimonial,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error,
      });
    }
  },

  deleteTestimonial: async (req, res) => {
    try {
      const { id } = req.body;
      const { error } = Testimonial_valid.validate(req.body);

      if (error) {
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [testimonial] = await db.query('SELECT * FROM testimonial WHERE id = ? ',[id]);

      if(testimonial.length === 0){
        logger.error(`Testimonial ${message.NOT_FOUND}`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Testimonial ${message.NOT_FOUND}`,
        });
      }

      await db.query('DELETE FROM testimonial WHERE id = ? ', [id]);

      logger.info(`Testimonial ${message.DELETE_SUCCESS}`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Testimonial ${message.DELETE_SUCCESS}`,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error,
      });
    }
  },
};
