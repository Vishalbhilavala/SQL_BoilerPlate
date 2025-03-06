const mysql = require('mysql2/promise');
require('dotenv').config();
const logger = require('../../app/services/logger');
const message = require('../utils/message')

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

pool.query('SELECT 1').then(()=>{
  logger.info(message.DATABASE_CONNECTION)
}).catch((error)=>{
  logger.error(message.DATABASE_CONNECTION_ERROR, error)
})

module.exports = pool;
