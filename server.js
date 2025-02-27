const express = require('express');
const app = express();

require('dotenv').config()
const UserRouter = require('./app/route/routes/user')

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = require('./app/middleware/database')

//Routes Api
app.use('/api/users', UserRouter)

//Server Connection
const port = process.env.PORT || 3030
app.listen(port, ()=>{
    console.log(`Server is Connected On Port: ${port}`)
})
