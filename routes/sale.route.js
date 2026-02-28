const express = require('express');
const router = express.Router();
const { createSaleWithItems, getSales, getSaleById, deleteSale } = require('../controller/sale.controller');

// GET all sales
router.get('/', getSales);

// GET sale by ID
router.get('/:id', getSaleById);

// POST create sale + items in one request
router.post('/', createSaleWithItems);

// DELETE sale (restores stock)
router.delete('/:id', deleteSale);

module.exports = router;