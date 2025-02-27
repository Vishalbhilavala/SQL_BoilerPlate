const sql = require('mysql2/promise')
require('dotenv').config()
// const message = require('../utils/message')

let connection = sql.createPool({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

connection.query('SELECT 1').then(()=>{
    console.log('db is conected')
}).catch((e)=>{
    console.log(`Error in db connection ${e}`)
})

module.exports = connection