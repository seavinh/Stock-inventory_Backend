const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/auth.Controller');
const { getAllUser, getUserById, updateUserById, deleteUserById, getProfile, updateProfile, updateProfileImage, createdUser } = require('../controller/users.Controller');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/multerConfig');

// ── Manage Users (Admin only) ──
router.post('/', protect, createdUser);

// ── Own profile (any logged-in user) ──
router.get('/profile/me', protect, getProfile);
router.patch('/profile/me', protect, updateProfile);
router.patch('/profile/me/image', protect, upload.single('profileImage'), updateProfileImage);

// ── Admin only ──
router.get('/', protect, getAllUser);
router.get('/:id', protect, getUserById);
router.patch('/:id', protect, updateUserById);
router.delete('/:id', protect, deleteUserById);

module.exports = router;
