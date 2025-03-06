const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, '../public/uploads');
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname);
      const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 100000)}${fileExt}`;
      cb(null, uniqueName);
    }
  })
  const MAX_SIZE = 1 * 1024 * 1024
  const fileFilter = (req, file, cb) => {
    if (!file) {
      return cb(new Error('Image file is required.'));
    }

    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);

    if (!mimeType) {
      return cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed.'));
    }
    cb(null, true);
  };

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
})


module.exports = {upload}