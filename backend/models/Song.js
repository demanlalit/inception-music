const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, trim: true },
    coverUrl: { type: String },
    audioUrl: { type: String, required: true },
    duration: { type: Number }, // in seconds (optional, can be set client-side)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

songSchema.index({ title: 'text', artist: 'text' });

module.exports = mongoose.model('Song', songSchema);

