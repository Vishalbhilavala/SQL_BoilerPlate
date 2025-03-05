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
  CreatePortfolio: async (req, res) => {
    try {
      let { category_id, product_name, description, image} = req.body;
      
      const { error } = create_portfolio_validate.validate(req.body);

      if (error) {
        logger.error('Error from portfolio validate');
        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
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

      logger.info('Portfolio Added Successfully');
      return res.status(200).json({
              statusCode: StatusCodes.CREATED,
              status: responseStatus.RESPONSE_SUCCESS,
              message: 'Portfolio Added Successfully',
            });


    } catch (error) {
      logger.error('Unexpected error', error);
      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  },
  
  commanFileUpload: async (req, res) => {

    let image = req.file.filename; 
    return res.send(image)
  },

  getListOfPortfolio: async (req, res) =>{
    try {

      let { page, data, sortBy, orderBy = "asc", search } = req.body;

      const [portfolio] = await db.query('SELECT * FROM portfolio'); 
      
      if(portfolio.length === 0){
        logger.log('Portfolio Data is Empty.')
        return res.status(200).json({
          status: responseStatus.RESPONSE_ERROR,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Portfolio Data is Empty.',
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
      
      return res.status(200).json({
          statusCode:StatusCodes.OK,
          status: responseStatus.RESPONSE_SUCCESS,
          message:"List Of all Portfolio",
          portfolio: show
      });

    } catch (error) {

      logger.error('Unexpected error:', error.message);

      return res
        .status(200)
        .json({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: responseStatus.RESPONSE_ERROR,
          error: error.message,
        });
    }
    
  },

  ListOfPortfolioByID: async (req, res) =>{
    try {
      const id = req.params.id

      const [portfolio] = await db.query('SELECT * FROM portfolio WHERE id = ?',[id]); 
      
      if(!portfolio.length){

        logger.error('Portfolio Not Found Provided Id.')
        return res.status(200).json({
          status: responseStatus.RESPONSE_ERROR,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Portfolio Not Found Provided Id.',
        });
      }
      
      return res.status(200).json({
          statusCode:StatusCodes.OK,
          status: responseStatus.RESPONSE_SUCCESS,
          message:"Portfolio Successfully Get",
          portfolio, 
      });

    } catch (error) {
      logger.error('Unexpected error is:', error);
      return res
        .status(200)
        .json({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: responseStatus.RESPONSE_ERROR,
          error: error.message,
        });
    }
    
  },

  UpdatePortfolio: async (req, res) =>{
    try {
      const { id, product_name, description } = req.body;

      const {error} = portfolio_id_check.validate({id});

      if(error){
        logger.error('Error from portfolio validation');

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [portfolio] = await db.query('SELECT * FROM portfolio WHERE id = ?',[id]);

      if(portfolio.length === 0){

        logger.error(`Portfolio with ID ${id} not found`);

        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Portfolio with ID ${id} not found`,
        });
      }
      if(product_name){
        
        await db.query('UPDATE portfolio SET product_name = ? WHERE id = ?', [product_name, id])
      }
      if(description){

        await db.query('UPDATE portfolio SET description = ? WHERE id = ?', [description, id])
      }

      logger.info(`Portfolio with ID ${id} updated successfully`);

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Portfolio with ID ${id} updated successfully`,
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

  DeletePortfolio: async (req, res) =>{
    try {
      
      const { id } = req.body;

      const { error } = portfolio_id_check.validate(req.body);

      if(error){

        logger.error('Error from portfolio validation');

        return res.status(200).json({
          statusCode: StatusCodes.BAD_REQUEST,
          status: responseStatus.RESPONSE_ERROR,
          error: `${error.details[0].message}`,
        });
      }

      const [portfolio] = await db.query('SELECT * FROM portfolio WHERE id = ?', [id]);

      if(portfolio.length === 0 ){
        logger.error(`Portfolio with ID ${id} not found`);

        return res.status(200).json({
          statusCode: StatusCodes.NOT_FOUND,
          status: responseStatus.RESPONSE_ERROR,
          message: `Portfolio with ID ${id} not found`,
        });
      }

      await db.query('DELETE FROM portfolio WHERE id = ?', [id])

      logger.info(`Portfolio with ID ${id} deleted successfully`);

      return res.status(200).json({
        statusCode: StatusCodes.OK,
        status: responseStatus.RESPONSE_SUCCESS,
        message: `Portfolio with ID ${id} deleted successfully`,
      });

    } catch (error) {

      logger.error('Unexpected error', error.message);

      return res.status(200).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        status: responseStatus.RESPONSE_ERROR,
        error: error.message,
      });
    }
  }
};
