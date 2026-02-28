const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sale Schema
const saleSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
    enum: ['cash', 'qr'],
    default: 'cash',
  },
  salePrice: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    required: false,
  },
  saleItemId: [{
    type: Schema.Types.ObjectId,
    ref: 'SaleItem',
    required: true,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);