const Candidate = require('../models/Candidate');

// Create a new candidate
exports.createCandidate = async (candidateData) => {
  const candidate = new Candidate(candidateData);
  return await candidate.save();
};

// Get all candidates
exports.getAllCandidates = async () => {
  return await Candidate.find();
};

// Get a candidate by ID
exports.getCandidateById = async (candidateId) => {
  return await Candidate.findOne({ candidateId });
};

// Update a candidate
exports.updateCandidate = async (candidateId, updateData) => {
  return await Candidate.findOneAndUpdate({ candidateId }, updateData, { new: true });
};

// Delete a candidate
exports.deleteCandidate = async (candidateId) => {
  return await Candidate.findOneAndDelete({ candidateId });
};
