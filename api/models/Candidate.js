const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: { type: String, unique: true, required: true }, // Unique Candidate ID
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  resume: { type: String, required: true },
  jobId: { type: String, required: true },
  stage: { type: String, required: true },
  interviewDate: { type: Date },
  interviewLocation: { type: String },
  reviewer: { type: String },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Candidate', candidateSchema);
