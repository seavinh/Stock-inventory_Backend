const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Function to generate a unique barcode
function generateBarcode() {
  return Date.now().toString() + Math.floor(Math.random() * 1000);
}

// Define the Product schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
    default: generateBarcode,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  description: { // កែអក្ខរាវិរុទ្ធត្រង់នេះ
    type: String,
    required: false,
  }
}, { timestamps: false });

module.exports = mongoose.model('Product', productSchema);
