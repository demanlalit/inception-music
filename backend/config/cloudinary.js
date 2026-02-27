const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const useCloudinary = process.env.STORAGE_DRIVER !== 'local';

if (useCloudinary) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

let audioUpload;
let imageUpload;

if (useCloudinary) {
  const audioStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'spotify-clone/audio',
      resource_type: 'video', // supports large audio files
    },
  });

  const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'spotify-clone/covers',
      resource_type: 'image',
    },
  });

  audioUpload = multer({ storage: audioStorage });
  imageUpload = multer({ storage: imageStorage });
} else {
  // Local storage fallback (for development without Cloudinary)
  const path = require('path');
  const fs = require('fs');

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
    },
  });

  audioUpload = multer({ storage: diskStorage });
  imageUpload = multer({ storage: diskStorage });
}

module.exports = {
  cloudinary,
  audioUpload,
  imageUpload,
  useCloudinary,
};

