const db = require('../middleware/database');
const logger = require('../services/logger');
const { GeneralError, BadRequest } = require('../utils/error');
const responseStatus = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const message = require('../utils/message');
const { GeneralResponse } = require('../utils/responce');
const { create_category_validate } = require('../validation/categoryvalidate');

module.exports = {
  CreateCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      const { error } = create_category_validate.validate({ category_name });
      if (error) {
        logger.error('Error from category validate');
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [category_existed] = await db.query(
        'SELECT * FROM categories WHERE LOWER(category_name) = ?',
        [category_name.toLowerCase()]
      );
      if (category_existed.length > 0) {
        logger.error(`${category_name} Allready Created`);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: `${category_name} Allready Created`,
          category_existed,
        });
      }

      const [category] = await db.query(
        'INSERT INTO categories(category_name) VALUES(?)',
        [category_name]
      );

      logger.info('Category Added Successfully');
        return res.status(200).json({
          statusCode: StatusCodes.CREATED,
          status: responseStatus.RESPONSE_SUCCESS,
          message: 'Category Added Successfully',
        });
    } catch (error) {
      logger.error('Unexpected error', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
  GetListOfCategory: async (req, res) => {
    try {
      let { page, data, sortBy, orderBy = "asc", search } = req.body;
      const [category] = await db.query('SELECT * FROM categories ');

      if(category.length === 0 ){

        logger.error(`Category Data is Empty.`);
        
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category Data is Empty.`,
        });
      }

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

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: 'List Of all Categories',
        Category: show,
      });

    } catch (error) {

      logger.error('Unexpected error', error.message);
      
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
  UpdateCategory: async (req, res) => {
    try {

      const { id, category_name } = req.body;

      const { error } = create_category_validate.validate({ category_name });

      if (error) {

        logger.error('Error from category validation');

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [category_existed] = await db.query(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );

      if (category_existed.length === 0) {
        logger.error(`Category with ID ${id} not found`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category with ID ${id} not found`,
        });
      }
      const [category_name_existed] = await db.query(
        'SELECT * FROM categories WHERE LOWER(category_name) = ?',
        [category_name.toLowerCase()]
      );
      if (category_name_existed.length > 0) {
        logger.error(`Category name "${category_name}" already exists`);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category name "${category_name}" already exists`,
        });
      }

      await db.query('UPDATE categories SET category_name = ? WHERE id = ?', [
        category_name,
        id,
      ]);
      logger.info(`Category with ID ${id} updated successfully`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category with ID ${id} updated successfully`,
      });

    } catch (error) {
      logger.error('Unexpected error', error.message);
      
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
  DeleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const [category_existed] = await db.query(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      if (category_existed.length === 0) {
        logger.error(`Category with ID ${id} not found`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Category with ID ${id} not found`,
        });
      }

      await db.query('DELETE FROM categories WHERE id = ?', [id]);

      logger.info(`Category with ID ${id} deleted successfully`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Category with ID ${id} deleted successfully`,
      });

    } catch (error) {
      logger.error('Unexpected error', error.message);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
};
