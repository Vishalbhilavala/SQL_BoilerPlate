const router = require('express').Router()
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category.route')
const portfolioRouter = require('./routes/portfolio.route')
const testmonialRouter = require('./routes/testimonial.routes')

router.use('/api/users', userRouter)
router.use('/api/category', categoryRouter)
router.use('/api/portfolio', portfolioRouter)
router.use('/api/testimonial ', testmonialRouter)

module.exports = router