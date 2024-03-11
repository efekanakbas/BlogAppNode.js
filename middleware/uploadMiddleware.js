const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cloudinary konfigürasyonu
cloudinary.config({
 cloud_name: "djgg4wjct",
 api_key: "419886385413456",
 api_secret: "7F71KL1LXG0P3FGMQZHNmJORvkQ",
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
const uploadMiddleware = async (req, res, next) => {
 upload(req, res, async function (err) {
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
     const urls = [];
     console.log("reqFİLES", req.files)
     if (req.files) {
      for (const file of req.files) {
        try {
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
              folder: "uploads",
              public_id: `${file.fieldname}-${uuidv4()}`,
            }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          });
          urls.push(result.secure_url);
        } catch (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary upload error" });
        }
      }
    }

     req.body.images = urls; // Yüklenen resimlerin URL'lerini req.body.images'e ekleyin
     next();
 });
};

module.exports = uploadMiddleware;
