const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

// Cloudinary configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage options for cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary'de resimlerin yükleneceği klasör
    public_id: (req, file) => `${file.fieldname}-${uuidv4()}`,
  },
});

// Multer options
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedMimes = ["image/png", "image/jpg", "image/jpeg"];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      console.log("Only jpg, png, jpeg files are supported");
      callback(null, false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB limit
  },
}).any();

// Middleware function using multer
const uploadMiddleware = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds the limit (2MB)" });
      } else {
        return res.status(500).json({ message: "Multer error" });
      }
    } else if (err) {
      return res.status(500).json({ message: "Unknown error" });
    }

    // Everything went fine, move to the next middleware or route handler
    next();
  });
};

module.exports = uploadMiddleware;
