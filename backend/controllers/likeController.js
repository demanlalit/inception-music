const Song = require('../models/Song');

// Like a song
const likeSong = async (req, res) => {
  const { songId } = req.params;

  const song = await Song.findById(songId);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  const userId = req.user._id.toString();
  if (!song.likes.map((id) => id.toString()).includes(userId)) {
    song.likes.push(userId);
    await song.save();
  }

  res.json(song);
};

// Unlike a song
const unlikeSong = async (req, res) => {
  const { songId } = req.params;

  const song = await Song.findById(songId);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  const userId = req.user._id.toString();
  song.likes = song.likes.filter((id) => id.toString() !== userId);
  await song.save();

  res.json(song);
};

// Get liked songs for current user
const getLikedSongs = async (req, res) => {
  const userId = req.user._id;
  const songs = await Song.find({ likes: userId }).sort({ createdAt: -1 });
  res.json(songs);
};

module.exports = {
  likeSong,
  unlikeSong,
  getLikedSongs,
};

