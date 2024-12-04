const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authService = require('../services/authService');
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'dineshreddy2805@gmail.com',
    pass: 'ngjp zoex vsaw uxwb',
  },
});


// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.authenticateUser(email, password);
    if (token) {
      const user = await User.findOne({ email }, { password: 0 }); // Exclude password
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ message: 'Login successful', token, userDetails: user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


// Fetch user details by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }, { password: 0 }); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role || password.length < 8) {
    return res.status(400).json({ message: 'Invalid data or weak password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'User Already Exists', error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { email, fullName, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to update user.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (password && password.length >= 8) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required to delete user.' });
  }

  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Create user with OTP verification for candidates
exports.createCandidateWithOTP = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Invalid data or weak password' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Create a new user with OTP
    const newUser = new User({ fullName, email, password: hashedPassword, role: 'candidate', otp });
    await newUser.save();

    // Send OTP via email
    await transporter.sendMail({
      from: '"E-Recruiter" <dineshreddy2805@gmail.com>',
      to: email,
      subject: 'Your OTP for Signup Verification',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(201).json({ message: 'Candidate created successfully. Please verify OTP.', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Verify OTP and finalize user creation
exports.verifyCandidateOTP = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    // Finalize user creation (remove OTP field)
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'User verified and created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }

};
