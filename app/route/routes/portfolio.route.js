const express = require('express');
let route = express.Router();
const { upload } = require('../../middleware/multer-auth')

const portfolioRouter = require('../../controller/portfolio.constroller')

route.post('/createPortfolio', portfolioRouter.createPortfolio)
route.post('/commanFileUpload', upload.single('photo'), portfolioRouter.commanFileUpload)
route.get('/getListOfPortfolio', portfolioRouter.getListOfPortfolio)
route.post('/viewPortfolio/:id', portfolioRouter.viewPortfolio)
route.put('/updatePortfolio', portfolioRouter.updatePortfolio)
route.delete('/deletePortfolio', portfolioRouter.deletePortfolio)


module.exports = route