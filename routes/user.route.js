const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/auth.Controller');
const { getAllUser, getUserById, updateUserById, deleteUserById, getProfile, updateProfile } = require('../controller/users.Controller');
const { protect } = require('../middleware/auth');

// ── Auth ──
router.post('/', registerUser);

// ── Own profile (any logged-in user) ──
router.get('/profile/me', protect, getProfile);
router.patch('/profile/me', protect, updateProfile);

// ── Admin only ──
router.get('/', getAllUser);
router.get('/:id', getUserById);
router.patch('/:id', updateUserById);
router.delete('/:id', deleteUserById);

module.exports = router;
