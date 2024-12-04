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
// Create user
exports.createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role || password.length < 8) {
    return res.status(400).json({ message: 'Invalid data or weak password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const status = role === 'employee' ? 'inactive' : 'active'; // Set status based on role

    const newUser = new User({ fullName, email, password: hashedPassword, role, status });
    await newUser.save();

    // If the role is employee, send a notification email
    if (role === 'employee') {
      await transporter.sendMail({
        from: '"E-Recruiter" <dineshreddy2805@gmail.com>',
        to: email,
        subject: 'Account Activation Required',
        text: `Dear ${fullName},\n\nYour account has been created but is currently inactive. Please contact your administrator to activate your account.\n\nThank you,\nE-Recruiter Team`,
      });
    }

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'User Already Exists', error: error.message });
  }
};


// Update user
// Update user
exports.updateUser = async (req, res) => {
  const { email, fullName, password, status } = req.body;

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
    if (status) user.status = status; // Ensure the status is updated

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
// Create user with OTP verification for candidates
exports.createCandidateWithOTP = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password || password.length < 8) {
    return res.status(400).json({ message: 'Invalid data or weak password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Save OTP and hashed password temporarily
    const otpRecord = { fullName, email, hashedPassword, otp };

    // Send OTP via email
    await transporter.sendMail({
      from: '"E-Recruiter" <your-email@gmail.com>',
      to: email,
      subject: 'Your OTP for Signup Verification',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(201).json({ message: 'OTP sent successfully', otpRecord });
  } catch (error) {
    console.error('Error creating candidate:', error.message);
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Verify OTP and create candidate
// Verify OTP and create candidate
exports.verifyCandidateOTP = async (req, res) => {
  const { otpRecord, otp } = req.body;

  if (!otpRecord || !otp) {
    return res.status(400).json({ message: 'OTP and OTP Record are required' });
  }

  try {
    // Ensure both OTPs are treated as strings for comparison
    if (String(otpRecord.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Create user after OTP verification
    const newUser = new User({
      fullName: otpRecord.fullName,
      email: otpRecord.email,
      password: otpRecord.hashedPassword,
      role: 'candidate',
      status: 'active', // Default for candidate
    });

    await newUser.save();

    res.status(200).json({ message: 'User verified and created successfully!' });
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};



