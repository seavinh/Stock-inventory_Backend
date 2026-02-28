const express = require('express');
const router = express.Router();
const { createPurchaseWithItems, getPurchases } = require('../controller/purchase.Controller');

// Route #1 → Create purchase + purchase items in one request
router.post('/', createPurchaseWithItems);

// Route #2 → Get all purchases
router.get('/', getPurchases);

module.exports = router;
