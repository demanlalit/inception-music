const Playlist = require('../models/Playlist');

// Create playlist
const createPlaylist = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const playlist = await Playlist.create({
    name,
    description,
    user: req.user._id,
    songs: [],
  });

  res.status(201).json(playlist);
};

// Add song to playlist
const addSongToPlaylist = async (req, res) => {
  const { id } = req.params;
  const { songId } = req.body;

  const playlist = await Playlist.findOne({ _id: id, user: req.user._id });
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  if (!songId) {
    return res.status(400).json({ message: 'songId is required' });
  }

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
  }

  await playlist.save();
  await playlist.populate('songs');

  res.json(playlist);
};

// Remove song from playlist
const removeSongFromPlaylist = async (req, res) => {
  const { id, songId } = req.params;

  const playlist = await Playlist.findOne({ _id: id, user: req.user._id });
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  playlist.songs = playlist.songs.filter(
    (s) => s.toString() !== songId.toString()
  );
  await playlist.save();
  await playlist.populate('songs');

  res.json(playlist);
};

// Get current user's playlists
const getUserPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ user: req.user._id }).populate('songs');
  res.json(playlists);
};

// Get single playlist with populated songs
const getPlaylistById = async (req, res) => {
  const playlist = await Playlist.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('songs');

  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  res.json(playlist);
};

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylists,
  getPlaylistById,
};

