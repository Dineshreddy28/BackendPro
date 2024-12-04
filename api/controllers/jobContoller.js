const { v4: uuidv4 } = require('uuid');
const jobService = require('../services/jobService');

// Create a new job description
exports.createJob = async (req, res) => {
  const { jobPostingName, description, salaryRange, experienceRequired } = req.body;

  if (!jobPostingName || !description || !salaryRange || !experienceRequired) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const jobData = {
      jobId: uuidv4(), // Generate a unique jobId
      jobPostingName,
      description,
      salaryRange,
      experienceRequired,
      lastUpdated: new Date(),
    };

    const job = await jobService.createJob(jobData);
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    console.error('Error creating job:', error.message);
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
};

// Get all job descriptions
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error retrieving jobs:', error.message);
    res.status(500).json({ message: 'Error retrieving jobs', error: error.message });
  }
};

// Get a job by jobId
exports.getJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await jobService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error.message);
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

// Update a job description
exports.updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { jobPostingName, description, salaryRange, experienceRequired } = req.body;

  try {
    const job = await jobService.updateJob(jobId, { jobPostingName, description, salaryRange, experienceRequired });
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    console.error('Error updating job:', error.message);
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

// Delete a job description
exports.deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await jobService.deleteJob(jobId);
    res.json({ message: 'Job deleted successfully', job });
  } catch (error) {
    console.error('Error deleting job:', error.message);
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};
