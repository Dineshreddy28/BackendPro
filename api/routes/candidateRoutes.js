const express = require('express');
const multer = require('multer');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

// Configure Multer for resume uploads
const storage = multer.diskStorage({
  destination: './uploads/resume',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Candidate Routes
router.post('/', upload.single('resume'), candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', upload.single('resume'), candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
