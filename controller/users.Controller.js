const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');

// store login role
let currentUserRole = null;

// Create a new user (only admin)
const createdUser = async (req, res) => {
  try {
    if (currentUserRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create users' });
    }
    const user = new User({ ...req.body });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN WITH TOKEN
const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(400).json({ message: 'Wrong password' });
    currentUserRole = user.role;
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT
const logoutUser = (req, res) => {
  currentUserRole = null;
  res.status(200).json({ message: 'Logout successful' });
};

// Get all users
const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (admin only)
const updateUserById = async (req, res) => {
  try {
    if (currentUserRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can update users' });
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user (admin only)
const deleteUserById = async (req, res) => {
  try {
    if (currentUserRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete users' });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════
// GET OWN PROFILE (any logged-in user)
// ════════════════════════════════
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ════════════════════════════════
// UPDATE OWN PROFILE (any logged-in user)
// Allows: userName, phoneNumber, and password change
// ════════════════════════════════
const updateProfile = async (req, res) => {
  try {
    const { userName, phoneNumber, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update basic fields
    if (userName) user.userName = userName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Password change — requires currentPassword verification
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Please provide your current password to change it.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(user._id).select('-password');
    res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createdUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
};
