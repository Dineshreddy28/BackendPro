const multer = require('multer');
const User = require('../models/User');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(file.mimetype);
    extname ? cb(null, true) : cb(new Error('Only images allowed'));
  },
});

exports.uploadSingle = upload.single('image');

// Update user image path in database
exports.updateUserImage = async (email, imagePath) => {
  const user = await User.findOneAndUpdate({ email }, { imagePath }, { new: true });
  if (!user) throw new Error('User not found');
  return user;
};
