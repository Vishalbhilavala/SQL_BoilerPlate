const db = require('../middleware/database');
const logger = require('../services/logger');
const { GeneralError, BadRequest } = require('../utils/error');
const responseStatus = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const message = require('../utils/message');
const { GeneralResponse } = require('../utils/responce');
const { create_category_validate } = require('../validation/categoryvalidate');

module.exports = {
  createCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      const { error } = create_category_validate.validate({ category_name });

      if (error) {
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [category_existed] = await db.query(
        'SELECT * FROM categories WHERE LOWER(category_name) = ?',
        [category_name.toLowerCase()]
      );

      if (category_existed.length > 0) {
        logger.error(`Category ${ message.ALREADY_EXIST }`);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category ${ message.ALREADY_EXIST }`,
          category_existed,
        });
      }

      const [category] = await db.query(
        'INSERT INTO categories(category_name) VALUES(?)',
        [category_name]
      );

      logger.info(`Category ${ message.ADD_SUCCESS }`);
      return res.status(200).json({
        statusCode: StatusCodes.CREATED,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category ${ message.ADD_SUCCESS }`,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  getListOfCategory: async (req, res) => {
    try {
      let { page, data, sortBy, orderBy = "asc", search } = req.body;
      const [category] = await db.query('SELECT * FROM categories ');
      let filteredCategory = category;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredCategory = category.filter(
          (category) =>
            category.category_name.toLowerCase().includes(searchLower)
        );
      }

      if (sortBy && filteredCategory.length > 0) {
        filteredCategory.sort((a, b) => {
          if (orderBy === "desc") {
            return b[sortBy] > a[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          }
        });
      }

      let StartIndex = (page - 1) * data;
      let EndIndex = StartIndex + data;
      const show = filteredCategory.slice(StartIndex, EndIndex);

      logger.info(`Category ${message.GET_SUCCESS}`)
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category ${message.GET_SUCCESS}`,
        Category: show,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  viewCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [
        id,
      ]);

      if (category.length === 0) {
        return res.json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category ${message.NOT_FOUND}`,
        });
      }
      logger.info(`Category ${message.GET_SUCCESS}`)
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category ${message.GET_SUCCESS}`,
        Category: category
      });
    } catch (error) {
      logger.error(error.message)
      return res
        .status(500)
        .json({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: responseStatus.RESPONSE_ERROR,
          error: error.message,
        });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id, category_name } = req.body;
      const { error } = create_category_validate.validate({ category_name });

      if (error) {
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [category_existed] = await db.query(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );

      if (category_existed.length === 0) {
        logger.error(`Category ${ message.NOT_FOUND}`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category ${ message.NOT_FOUND}`,
        });
      }

      const [category_name_existed] = await db.query(
        'SELECT * FROM categories WHERE LOWER(category_name) = ?',
        [category_name.toLowerCase()]
      );

      if (category_name_existed.length > 0) {
        logger.error(`Category ${message.ALREADY_EXIST}`);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category ${message.ALREADY_EXIST}`,
        });
      }

      await db.query('UPDATE categories SET category_name = ? WHERE id = ?', [
        category_name,
        id,
      ]);
      
      logger.info(`Category ${message.UPDATED_SUCCESS}`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category ${message.UPDATED_SUCCESS}`,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const [category_existed] = await db.query(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      
      if (category_existed.length === 0) {
        logger.error(`Category ${ message.NOT_FOUND }`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category ${ message.NOT_FOUND }`,
        });
      }

      await db.query('DELETE FROM categories WHERE id = ?', [id]);

      logger.info(`Category ${message.DELETE_SUCCESS}`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category ${message.DELETE_SUCCESS}`,
      });
    } catch (error) {
      logger.error(error.message);
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
};
