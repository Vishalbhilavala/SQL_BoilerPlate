const db = require('../middleware/database');
const logger = require('../services/logger');
const { GeneralError, BadRequest } = require('../utils/error');
const responseStatus = require('../utils/enum');
const { StatusCodes } = require('http-status-codes');
const message = require('../utils/message');
const { GeneralResponse } = require('../utils/responce');
const {create_portfolio_validate, portfolio_id_check} = require('../validation/portfoliovalidate');
const { Logger } = require('winston');
const path = require('path')

module.exports = {
  createPortfolio: async (req, res) => {
    try {
      let { category_id, product_name, description, image} = req.body;
      const { error } = create_portfolio_validate.validate(req.body);

      if (error) {
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [portfolio] = await db.query(
        'INSERT INTO portfolio(category_id, product_name, description) VALUES(?, ?, ?)',
        [category_id, product_name, description]
      );
      
      const image_id = portfolio.insertId
      
      if(image) {
        await db.query('INSERT INTO imagies(portfolio_id, image_path) VALUES(?, ?)',[image_id, image])
      }

      logger.info(`Portfolio ${message.ADD_SUCCESS}`);
      return res.status(200).json({
              statusCode: StatusCodes.CREATED,
              status: responseStatus.RESPONSE_SUCCESS,
              message: `Portfolio ${message.ADD_SUCCESS}`,
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
  
  commanFileUpload: (req, res) => {
    try {
      if (!req.file) {
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          message : message.FILE_NOT_FOUND
        });
      }

      let image = req.file.filename;

      logger.info(`Image ${message.ADD_SUCCESS}`)
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Image ${message.ADD_SUCCESS}`,
        image_path : image
      });
    } catch (error) {
      logger.error(error.message)
      return res.status(500).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },

  getListOfPortfolio: async (req, res) =>{
    try {
      let { page, data, sortBy, orderBy = "asc", search } = req.body;
      const [portfolio] = await db.query('SELECT portfolio.*, imagies.image_path FROM portfolio LEFT JOIN imagies ON portfolio.id = imagies.portfolio_id'); 
      
      if(portfolio.length === 0){
        logger.log(`Portfolio ${message.NOT_FOUND}`)
        return res.status(200).json({
          status: responseStatus.RESPONSE_ERROR,
          statusCode: StatusCodes.NOT_FOUND,
          message: `Portfolio ${message.NOT_FOUND}`,
        });
      }

      let filteredPortfolio = portfolio;

      if (search) {
        const searchLower = search.toLowerCase();
        filteredPortfolio = portfolio.filter(
          (Portfolio) =>
            Portfolio.product_name.toLowerCase().includes(searchLower)
        );
      }

      if (sortBy && filteredPortfolio.length > 0) {
        filteredPortfolio.sort((a, b) => {
          if (orderBy === "desc") {
            return b[sortBy] > a[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          }
        });
      }

      let StartIndex = (page - 1) * data;
      let EndIndex = StartIndex + data;

      const show = filteredPortfolio.slice(StartIndex, EndIndex);
      
      logger.info(`Portfolio ${message.GET_SUCCESS}`)
      return res.status(200).json({
          statusCode:StatusCodes.OK,
          status: responseStatus.RESPONSE_SUCCESS,
          message:  `Portfolio ${message.GET_SUCCESS}`,
          portfolio: show
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

  viewPortfolio: async (req, res) =>{
    try {
      const id = req.params.id
      const [portfolio] = await db.query('SELECT portfolio.*, imagies.image_path FROM portfolio LEFT JOIN imagies ON portfolio.id = imagies.portfolio_id WHERE portfolio.id = ? ',[id]); 
      
      if(portfolio.length === 0){
        logger.error(`Portfolio ${message.NOT_FOUND}`)
        return res.status(200).json({
          status: responseStatus.RESPONSE_ERROR,
          statusCode: StatusCodes.NOT_FOUND,
          message: `Portfolio ${message.NOT_FOUND}`,
        });
      }
      
      logger.info(`Portfolio ${message.GET_SUCCESS}`)
      return res.status(200).json({
          statusCode:StatusCodes.OK,
          status: responseStatus.RESPONSE_SUCCESS,
          message: `Portfolio ${message.GET_SUCCESS}`,
          portfolio, 
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

  updatePortfolio: async (req, res) =>{
    try {
      const { id, product_name, description } = req.body;
      const {error} = portfolio_id_check.validate({id});

      if(error){
        logger.error(error);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [portfolio] = await db.query('SELECT * FROM portfolio WHERE id = ?',[id]);

      if(portfolio.length === 0){
        logger.error(`Portfolio ${message.NOT_FOUND}`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Portfolio ${message.NOT_FOUND}`,
        });
      }
      if(product_name){
        await db.query('UPDATE portfolio SET product_name = ? WHERE id = ?', [product_name, id])
      }

      if(description){
        await db.query('UPDATE portfolio SET description = ? WHERE id = ?', [description, id])
      }

      logger.info(`Portfolio ${message.UPDATED_SUCCESS}`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Portfolio ${message.UPDATED_SUCCESS}`,
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

  deletePortfolio: async (req, res) =>{
    try {
      const { id } = req.body;
      const { error } = portfolio_id_check.validate(req.body);

      if(error){
        logger.error(error.message);
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: error.details[0].message,
        });
      }

      const [portfolio] = await db.query('SELECT * FROM portfolio WHERE id = ?', [id]);

      if(portfolio.length === 0 ){
        logger.error(`Portfolio ${message.NOT_FOUND}`);
        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Portfolio ${message.NOT_FOUND}`,
        });
      }

      await db.query('DELETE FROM portfolio WHERE id = ?', [id])

      logger.info(`Portfolio ${message.DELETE_SUCCESS}`);
      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Portfolio ${message.DELETE_SUCCESS}`,
      });
    } catch (error) {
      logger.error(error);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error,
      });
    }
  }
};
