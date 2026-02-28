const express = require('express');
const router = express.Router();
const {loginUser} = require('../controller/auth.Controller');

// Debug: Check if loginUser is defined
console.log('loginUser function:', loginUser);
console.log('Type:', typeof loginUser);

router.post('/', loginUser);

module.exports = router;