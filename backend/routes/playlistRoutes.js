const express = require('express');
const {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createPlaylist);
router.get('/', protect, getUserPlaylists);
router.get('/:id', protect, getPlaylistById);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);

module.exports = router;

