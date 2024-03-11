const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer yapılandırması
const upload = multer({
 storage: multer.memoryStorage(), // Dosyaları bellekte tut
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

// Middleware fonksiyonu
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

    // Dosyaları Cloudinary'ye yükle
    const promises = req.files.map(file => {
      return cloudinary.uploader.upload_stream({
        folder: "uploads",
        public_id: `${file.fieldname}-${uuidv4()}`,
      }, (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary upload error" });
        }
        // Dosya başarıyla yüklendi, sonuçları req.body'ye ekleyin!
        req.body[file.fieldname] = result.secure_url;
      }).end(file.buffer);
    });

    Promise.all(promises)
      .then(() => next())
      .catch(err => res.status(500).json({ message: "Cloudinary upload error" }));
 });
};

module.exports = uploadMiddleware;
