const express = require('express');
const {
  likeSong,
  unlikeSong,
  getLikedSongs,
} = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getLikedSongs);
router.post('/:songId', protect, likeSong);
router.delete('/:songId', protect, unlikeSong);

module.exports = router;

