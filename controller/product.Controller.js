const mongoose = require('mongoose');
const Product = require('../models/productsModel');

/* ================= CREATE ================= */
const createProduct = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const product = new Product({
      productName: req.body.productName,
      barcode: req.body.barcode || undefined, // បើគ្មាន barcode វានឹងប្រើ default ក្នុង Schema
      categoryId: req.body.categoryId,
      cost: Number(req.body.cost), // បំប្លែងជាលេខ
      price: Number(req.body.price), // បំប្លែងជាលេខ
      stockQuantity: Number(req.body.stockQuantity), // បំប្លែងជាលេខ
      description: req.body.description,
      img: req.file ? `/uploads/${req.file.filename}` : ''
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'categoryName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */
const updateProductById = async (req, res) => {
  try {
    const updateData = {
      productName: req.body.productName,
      barcode: req.body.barcode,
      categoryId: req.body.categoryId,
      cost: Number(req.body.cost), // បំប្លែងជាលេខ
      price: Number(req.body.price), // បំប្លែងជាលេខ
      stockQuantity: Number(req.body.stockQuantity), // បំប្លែងជាលេខ
      description: req.body.description
    };

    if (req.file) {
      updateData.img = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // បន្ថែម runValidators ដើម្បីឆែកលក្ខខណ្ឌ
    );

    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('UPDATE ERROR:', error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById
};
