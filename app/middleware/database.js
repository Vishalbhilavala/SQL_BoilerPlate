const mysql = require('mysql2/promise');
require('dotenv').config();
const logger = require('../../app/services/logger');
const { StatusCodes } = require('http-status-codes');
const responseStatus = require('../utils/enum');
const { error } = require('winston');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

pool.query('SELECT 1').then(()=>{
  logger.info(`DataBase is Connected On : ${process.env.DATABASE}`)
}).catch((error)=>{
  logger.error(`Error in DataBase Connection: ${error}`)
})

module.exports = pool;
