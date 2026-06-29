const express = require('express');
const router = express.Router();
const multer = require('multer');
const { upload } = require('../middleware/uploadMiddleware');
const {
  uploadSingle,
  uploadMultiple,
  listImages,
  deleteImage,
} = require('../controllers/uploadController');

// Wraps a multer middleware call so its errors (file too big, bad type, etc.)
// come back as clean JSON instead of crashing/hanging the request.
const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Max size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.get('/', listImages);
router.post('/', handleUpload(upload.single('image')), uploadSingle);
router.post('/multiple', handleUpload(upload.array('images', 10)), uploadMultiple);
router.delete('/:filename', deleteImage);

module.exports = router;
