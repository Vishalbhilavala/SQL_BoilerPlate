const express = require('express');
let route = express.Router();
const { upload } = require('../../middleware/multer-auth')

const testimonialRouter = require('../../controller/testimonial.controller')

route.post('/createTestimonial', testimonialRouter.createTestimonial)



module.exports = route
