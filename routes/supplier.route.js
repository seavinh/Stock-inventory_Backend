const express = require('express');
const router = express.Router();
const {
  createSupplier,
  getAllSuppliers,
  getSuppliersByNameLetter,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
} = require('../controller/supplier.Controller');

// ✅ CREATE - Add new supplier
router.post('/', createSupplier);

// ✅ READ - Get all suppliers
router.get('/', getAllSuppliers);

// ✅ SEARCH - Get suppliers by name letter
router.get('/search', getSuppliersByNameLetter);

// ✅ READ - Get supplier by ID
router.get('/:id', getSupplierById);

// ✅ UPDATE - Edit supplier by ID
router.patch('/:id', updateSupplierById);

// ✅ DELETE - Remove supplier by ID
router.delete('/:id', deleteSupplierById);

module.exports = router;