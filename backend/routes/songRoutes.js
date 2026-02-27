const express = require('express');
const {
  uploadSong,
  getSongs,
  getSongById,
  searchSongs,
  streamSong,
} = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');
const { audioUpload, imageUpload } = require('../config/cloudinary');

const router = express.Router();

// Combined middleware to handle both audio and optional cover image
const uploadFields = [
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
];

router.post(
  '/',
  protect,
  (req, res, next) => {
    // Use multer's fields API with our configured uploaders
    // Audio
    audioUpload.single('audio')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Audio upload error' });
      }
      req.audioFile = req.file;
      // Cover (optional)
      imageUpload.single('cover')(req, res, (err2) => {
        if (err2) {
          return res
            .status(400)
            .json({ message: err2.message || 'Cover upload error' });
        }
        req.coverFile = req.file;
        next();
      });
    });
  },
  uploadSong
);

router.get('/', getSongs);
router.get('/search', searchSongs);
router.get('/:id', getSongById);
router.get('/:id/stream', streamSong);

module.exports = router;

