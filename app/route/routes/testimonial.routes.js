const express = require('express');
let route = express.Router();

const { upload } = require('../../middleware/multer-auth')

const testimonialRouter = require('../../controller/testimonial.controller')

route.post('/createTestimonial', testimonialRouter.createTestimonial)
route.get('/getListOfTestimonial', testimonialRouter.getListOfTestimonial)
route.post('/viewTestimonial/:id', testimonialRouter.viewTestimonial)
route.put('/updateTestimonial', testimonialRouter.updateTestimonial)
route.delete('/deleteTestimonial', testimonialRouter.deleteTestimonial)



module.exports = route
