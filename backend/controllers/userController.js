const User = require('../models/User');

// Get current user's profile
const getMe = async (req, res) => {
  res.json(req.user);
};

// Update current user's profile
const updateMe = async (req, res) => {
  const { name, avatarUrl } = req.body;

  if (name !== undefined) {
    req.user.name = name;
  }

  if (avatarUrl !== undefined) {
    req.user.avatarUrl = avatarUrl;
  }

  const updated = await req.user.save();
  res.json(updated);
};

module.exports = {
  getMe,
  updateMe,
};

