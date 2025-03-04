const router = require('express').Router()
const UserRouter = require('./routes/user')
const CategoryRouter = require('./routes/category.route')


router.use('/api/users', UserRouter)
router.use('/api/category', CategoryRouter)

module.exports = router