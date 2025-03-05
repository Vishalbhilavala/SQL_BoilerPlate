const router = require('express').Router()
const UserRouter = require('./routes/user')
const CategoryRouter = require('./routes/category.route')
const PortfolioRouter = require('./routes/portfolio.route')


router.use('/api/users', UserRouter)
router.use('/api/category', CategoryRouter)
router.use('/api/portfolio', PortfolioRouter)

module.exports = router