const multer = require('multer');
const path = require('path');

// 🔥 Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profileImage') {
      cb(null, path.join(__dirname, '../uploads/providers/profile'));
    } else if (
      file.fieldname === 'aadharFrontImage' ||
      file.fieldname === 'aadharBackImage'
    ) {
      cb(null, path.join(__dirname, '../uploads/providers/aadhar'));
    } else {
      cb(null, path.join(__dirname, '../uploads'));
    }
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + '-' + file.originalname.replace(/\s+/g, '');
    cb(null, uniqueName);
  },
});

// 🔒 File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;