mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Purchase Schema
const purchaseSchema = new mongoose.Schema({
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  PurchaseCost: {
    type: Number,
    required: true,
  },
  purchaseItemId: [{
    type: Schema.Types.ObjectId,
    ref: 'PurchaseItem',
    required: true,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);




