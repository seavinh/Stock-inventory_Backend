const express = require('express');
const router = express.Router();
const { generateQRCode, checkPaymentStatus } = require('../controller/bakong.Controller');

// Define Bakong payment routes
router.post('/generate', generateQRCode);
router.post('/check', checkPaymentStatus);

module.exports = router;
