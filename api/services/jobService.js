const Job = require('../models/Job');

// Create a new job description
exports.createJob = async (jobData) => {
  const newJob = new Job(jobData);
  return await newJob.save();
};

// Get all job descriptions
exports.getAllJobs = async () => {
  return await Job.find({}, { jobPostingName: 1, description: 1, salaryRange: 1, experienceRequired: 1, lastUpdated: 1, jobId: 1 });
};

// Get a job by jobId
exports.getJobById = async (jobId) => {
  return await Job.findOne({ jobId });
};

// Update a job description
exports.updateJob = async (jobId, updatedData) => {
  const job = await Job.findOne({ jobId });
  if (!job) throw new Error('Job not found');

  job.jobPostingName = updatedData.jobPostingName || job.jobPostingName;
  job.description = updatedData.description || job.description;
  job.salaryRange = updatedData.salaryRange || job.salaryRange;
  job.experienceRequired = updatedData.experienceRequired || job.experienceRequired;
  job.lastUpdated = new Date();

  return await job.save();
};

// Delete a job description
exports.deleteJob = async (jobId) => {
  const job = await Job.findOneAndDelete({ jobId });
  if (!job) throw new Error('Job not found');
  return job;
};
