const express = require('express');
const userController = require('../controllers/userController');
const multer = require('multer');

const router = express.Router();

// Multer configuration
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

// Routes
router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.post('/create-candidate', userController.createCandidateWithOTP);
router.post('/verify-otp', userController.verifyCandidateOTP);
router.get('/details', userController.getUserByEmail);
router.get('/getAll', userController.getAllUsers);
router.put('/edit', userController.updateUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;
