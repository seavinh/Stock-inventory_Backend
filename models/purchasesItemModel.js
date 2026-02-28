mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Purchase Item schema
const purchaseSchema = new mongoose.Schema({
  purchaseId: {
    type: Schema.Types.ObjectId,
    ref: 'Purchase',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    required: false,
  },
}, { timestamps: true });


module.exports = mongoose.model('PurchaseItem', purchaseSchema);