const router = require('express').Router()
const UserRouter = require('./routes/user')

router.use('/api/users', UserRouter)

module.exports = router