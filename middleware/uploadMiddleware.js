const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueFilename = uuidv4();
    const filename = file.fieldname + "-" + uniqueFilename + ext;

    cb(null, filename);
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
