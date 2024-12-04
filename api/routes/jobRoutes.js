const express = require('express');
const jobController = require('../controllers/jobContoller');

const router = express.Router();

router.post('/create', jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/:jobId', jobController.getJobById); // New route to get job by jobId
router.put('/:jobId', jobController.updateJob);
router.delete('/:jobId', jobController.deleteJob);

module.exports = router;
