const express = require('express');
let route = express.Router();
const { upload } = require('../../middleware/multer-auth')

const PortfolioRouter = require('../../controller/portfolio.constroller')

route.post('/portfoliocreate', PortfolioRouter.CreatePortfolio)
route.post('/commanfileupload', upload.single('photo'), PortfolioRouter.commanFileUpload)
route.get('/listofportfolio', PortfolioRouter.getListOfPortfolio)
route.get('/portfoliobyid/:id', PortfolioRouter.ListOfPortfolioByID)
route.post('/updateportfolio', PortfolioRouter.UpdatePortfolio)
route.post('/deleteportfolio', PortfolioRouter.DeletePortfolio)


module.exports = route