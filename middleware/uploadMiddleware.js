const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');

// Cloudinary configurations
cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
// cloud_name: "djgg4wjct",
//  api_key: "419886385413456",
//  api_secret: "7F71KL1LXG0P3FGMQZHNmJORvkQ",
});

// Multer configurations
const upload = multer({
 storage: multer.memoryStorage(), // Holds files at memory
 fileFilter: function (req, file, callback) {
    const allowedMimes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      console.log("Only jpg, png, jpeg and pdf files are supported");
      callback(null, false);
    }
 },
 limits: {
    fileSize: 1024 * 1024 * 2, // 2MB limit
 },
}).any();

// Middleware configurations
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

     // Uploads files on cloudinary
     const urls = [];
     if (req.files) {
      for (const file of req.files) {
        console.log("zAAAAAAAA", file.originalname)
        try {
           // Dosya adının uzantısını alır
      const extension = path.extname(file.originalname);
      // Dosya adını uzantıdan temizler
      const fileNameWithoutExtension = path.basename(file.originalname, extension);

      
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
              folder: "uploads",
              public_id: `${file.fieldname}-${uuidv4()}-${fileNameWithoutExtension}`,
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

     req.body.images = urls; // Adds uploaded files to request's body
     next();
 });
};

module.exports = uploadMiddleware;
