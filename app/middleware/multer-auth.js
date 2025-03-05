const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../public/uploads');
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname); // Get the file extension
      const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 100000)}${fileExt}`; // Generate unique name
      cb(null, uniqueName);
    }
  })


const upload = multer({storage})

module.exports = {upload}