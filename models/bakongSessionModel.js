const mongoose = require('mongoose');

const bakongSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        quantity: { type: Number, required: true },
        remarks: { type: String }
    }],
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['usd', 'khr'],
        default: 'usd'
    },
    qrString: {
        type: String,
        required: true
    },
    md5: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'expired'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('BakongSession', bakongSessionSchema);
