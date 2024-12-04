const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, required: true },
  jobPostingName: { type: String, required: true },
  description: { type: String, required: true },
  salaryRange: { type: String, required: true },
  experienceRequired: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
