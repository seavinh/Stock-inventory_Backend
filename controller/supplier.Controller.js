const Supplier = require('../models/supplierModel');
const mongoose = require('mongoose');




exports.getSuppliersByNameLetter = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ error: 'Search parameter is required' });
    }

    // Search in multiple fields
    const suppliers = await Supplier.find({
      $or: [
        { supplierName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).json({ error: error.message });
  }
};
// ✅ CREATE - Add new supplier
exports.createSupplier = async (req, res) => {
  try {
    const { supplierName, contactEmail, phoneNumber, address } = req.body;

    // Validation
    if (!supplierName || !contactEmail || !phoneNumber || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newSupplier = await Supplier.create({
      supplierName,
      contactEmail,
      phoneNumber,
      address,
    });

    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ READ - Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ SEARCH - Get suppliers by name letter
exports.getSuppliersByNameLetter = async (req, res) => {
  try {
    const { letter } = req.query;

    if (!letter) {
      return res.status(400).json({ error: 'Letter parameter is required' });
    }

    const suppliers = await Supplier.find({
      supplierName: { $regex: `^${letter}`, $options: 'i' },
    });

    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error searching suppliers:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ READ - Get supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE - Edit supplier by ID
exports.updateSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE - Remove supplier by ID
exports.deleteSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const deletedSupplier = await Supplier.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully', deletedSupplier });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: error.message });
  }
};