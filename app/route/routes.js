const router = require('express').Router()
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category.route')


router.use('/api/users', userRouter)
router.use('/api/category', categoryRouter)

module.exports = router