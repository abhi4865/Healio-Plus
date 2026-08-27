const multer = require("multer");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, PDF allowed."), false);
    }
    cb(null, true);
  },
});

function maybeUploadSingle(fieldName) {
  const single = upload.single(fieldName);
  return (req, res, next) => {
    if (!req.is("multipart/form-data")) {
      return next();
    }
    single(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      return next();
    });
  };
}

module.exports = { upload, maybeUploadSingle };

