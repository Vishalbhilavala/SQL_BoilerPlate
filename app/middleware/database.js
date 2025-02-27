const sql = require('mysql2')
require('dotenv').config()
const message = require('../utils/message')

let connection = sql.createConnection({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

connection.connect(function (error) {
    if (error) {
        throw new Error('Error is There');
    }else{
        console.log(message.DATABASE_CONNECTION);
    }
})

module.exports = connection