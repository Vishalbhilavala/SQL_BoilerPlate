const express = require('express');
let route = express.Router();
const { upload } = require('../../middleware/multer-auth')

const PortfolioRouter = require('../../controller/portfolio.constroller')

route.post('/portfoliocreate', PortfolioRouter.createPortfolio)
route.post('/commanfileupload', upload.single('photo'), PortfolioRouter.commanFileUpload)
route.get('/getlistofportfolio', PortfolioRouter.getListOfPortfolio)
route.post('/portfoliobyid/:id', PortfolioRouter.listOfPortfolioByID)
route.put('/updateportfolio', PortfolioRouter.updatePortfolio)
route.delete('/deleteportfolio', PortfolioRouter.deletePortfolio)


module.exports = route