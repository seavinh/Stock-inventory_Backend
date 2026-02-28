const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SaleItem Schema
const saleItemSchema = new mongoose.Schema({
  saleId: {
    type: Schema.Types.ObjectId,
    ref: 'Sale',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    required: false,
  },
}, { timestamps: true});

module.exports = mongoose.model('SaleItem', saleItemSchema);
