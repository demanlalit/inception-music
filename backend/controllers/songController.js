const Song = require('../models/Song');
const { useCloudinary, cloudinary } = require('../config/cloudinary');

// Upload a new song (metadata + files)
const uploadSong = async (req, res) => {
  const { title, artist, album } = req.body;

  if (!title || !artist) {
    return res.status(400).json({ message: 'Title and artist are required' });
  }

  let audioUrl;
  let coverUrl;

  // Multer puts files on req.file / req.files depending on setup
  if (req.audioFile) {
    audioUrl = req.audioFile.path;
  } else if (req.files && req.files.audio && req.files.audio[0]) {
    audioUrl = req.files.audio[0].path;
  } else if (req.file && req.file.fieldname === 'audio') {
    audioUrl = req.file.path;
  }

  if (!audioUrl) {
    return res.status(400).json({ message: 'Audio file is required' });
  }

  if (req.coverFile) {
    coverUrl = req.coverFile.path;
  } else if (req.files && req.files.cover && req.files.cover[0]) {
    coverUrl = req.files.cover[0].path;
  }

  const song = await Song.create({
    title,
    artist,
    album,
    coverUrl,
    audioUrl,
    uploadedBy: req.user ? req.user._id : null,
  });

  res.status(201).json(song);
};

// Get all songs
const getSongs = async (req, res) => {
  const songs = await Song.find().sort({ createdAt: -1 });
  res.json(songs);
};

// Get single song by ID
const getSongById = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }
  res.json(song);
};

// Search songs by title or artist (case insensitive)
const searchSongs = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  const regex = new RegExp(query, 'i');
  const songs = await Song.find({
    $or: [{ title: regex }, { artist: regex }],
  }).sort({ createdAt: -1 });

  res.json(songs);
};

// Optional: redirect to audio URL for streaming
const streamSong = async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    return res.status(404).json({ message: 'Song not found' });
  }

  // For Cloudinary / S3 URLs, redirect allows client to stream directly
  return res.redirect(song.audioUrl);
};

module.exports = {
  uploadSong,
  getSongs,
  getSongById,
  searchSongs,
  streamSong,
};

