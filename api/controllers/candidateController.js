const { v4: uuidv4 } = require('uuid');
const candidateService = require('../services/candiateService');
const jobService = require('../services/jobService');
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'dineshreddy2805@gmail.com',
    pass: 'ngjp zoex vsaw uxwb',
  },
});

// Create a new candidate
exports.createCandidate = async (req, res) => {
  const { firstName, lastName, mobileNo, email, jobId, stage } = req.body;

  if (!firstName || !lastName || !mobileNo || !email || !req.file || !jobId || !stage) {
    return res.status(400).json({ message: 'All fields are required, including the resume and stage.' });
  }

  try {
    // Fetch job details for email content
    const job = await jobService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    const candidateData = {
      candidateId: uuidv4(), // Generate a unique candidateId
      firstName,
      lastName,
      mobileNo,
      email,
      resume: req.file.path,
      jobId,
      stage,
    };

    const candidate = await candidateService.createCandidate(candidateData);

    // Send email to the candidate
    const mailOptions = {
      from: '"E-Recruiter" <dineshreddy2805@gmail.com>',
      to: email,
      subject: `Thank You for Applying for ${job.jobPostingName}`,
      text: `Dear ${firstName} ${lastName},\n\nThank you for applying to the position of ${job.jobPostingName}. We have successfully received your application and resume. Our team will review your application, and you will be notified if you are shortlisted for further rounds.\n\nBest regards,\nRecruitment Team\nE-Recruiter`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Candidate created successfully and email sent', candidate });
  } catch (error) {
    console.error('Error creating candidate:', error.message);
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await candidateService.getAllCandidates();
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error.message);
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

// Get candidate by candidateId
exports.getCandidateById = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error.message);
    res.status(500).json({ message: 'Error fetching candidate', error: error.message });
  }
};

// Update a candidate
exports.updateCandidate = async (req, res) => {
  const { candidateId } = req.params;
  const { stage, review, reviewer, interviewDate, interviewLocation } = req.body;

  const updateData = { stage };
  if (review) updateData.review = review;
  if (reviewer) updateData.reviewer = reviewer;
  if (interviewDate) updateData.interviewDate = interviewDate;
  if (interviewLocation) updateData.interviewLocation = interviewLocation;

  if (req.file) {
    updateData.resume = req.file.path; // Only update the resume if a new file is uploaded
  }

  try {
    const candidate = await candidateService.updateCandidate(candidateId, updateData);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate updated successfully', candidate });
  } catch (error) {
    console.error('Error updating candidate:', error.message);
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};

// Delete a candidate
exports.deleteCandidate = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const candidate = await candidateService.deleteCandidate(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully', candidate });
  } catch (error) {
    console.error('Error deleting candidate:', error.message);
    res.status(500).json({ message: 'Error deleting candidate', error: error.message });
  }
};
