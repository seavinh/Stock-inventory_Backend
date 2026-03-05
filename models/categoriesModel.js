const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false
  }
}, { timestamps: false });

module.exports = mongoose.model('Category', categorySchema);