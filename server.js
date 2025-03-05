const express = require('express');
const app = express();
require('dotenv').config()

const helmet = require('helmet')
const path = require('path')
const cors = require('cors')
const logger = require('./app/services/logger')

//public path
app.use(express.static(path.join(__dirname, 'app', 'public')))

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet())
app.use(cors())

//Routes Api
app.use('/', require('./app/route/routes'))

//Server Connection
const port = process.env.PORT || 3030
app.listen(port, ()=>{
    logger.info(`Server is Connected On Port: ${port}`)
})
