const sql = require('mysql2/promise')
require('dotenv').config()
const message = require('../utils/message')

let connection = sql.createPool({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

connection.query('SELECT 1').then(()=>{
    console.log(message.DATABASE_CONNECTION,)

}).catch((e)=>{
    console.log( message.DATABASE_CONNECTION_ERROR, e )
})

module.exports = connection