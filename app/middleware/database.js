const sql = require('mysql2')
require('dotenv').config()
const message = require('../utils/message')
const logger = require('../services/logger')

let connection = sql.createConnection({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

connection.connect(function (error) {
    if (error) {
        logger.error('Error is There');
    }else{
        logger.info(message.DATABASE_CONNECTION);
    }
})

module.exports = connection