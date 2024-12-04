const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Create a new user
exports.createUser = async ({ fullName, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fullName, email, password: hashedPassword });
  return await newUser.save();
};

// Get all users without passwords
exports.getAllUsers = async () => {
  return await User.find({}, { fullName: 1, email: 1 });
};

// Update user information
exports.updateUser = async (email, { fullName, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  user.fullName = fullName || user.fullName;
  if (password && password.length >= 8) {
    user.password = await bcrypt.hash(password, 10);
  }
  return await user.save();
};

// Delete user by email
exports.deleteUser = async (email) => {
  const user = await User.findOneAndDelete({ email });
  if (!user) throw new Error('User not found');
  return user;
};
