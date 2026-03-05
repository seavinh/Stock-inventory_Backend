const crypto = require('crypto');
const BakongSession = require('../models/bakongSessionModel');
const Sale = require('../models/saleModel');
const SaleItem = require('../models/saleItemModel');
const Product = require('../models/productsModel');
const { generateQR, verifyPayment } = require('../utils/bakong');

// POST /api/bakong/generate
const generateQRCode = async (req, res) => {
    try {
        const { userId, items, amount, currency, remark } = req.body;

        if (!userId || !items || items.length === 0 || !amount) {
            return res.status(400).json({ message: 'Missing required parameters.' });
        }

        const sessionId = crypto.randomUUID();
        const qrResult = generateQR(amount, currency, sessionId);

        if (!qrResult || qrResult.failedStatus || qrResult.exceptionMessage) {
            const errStr = qrResult ? JSON.stringify(qrResult) : 'Null result';
            return res.status(500).json({ message: `Bakong Crash Details: ${errStr}` });
        }

        const session = await BakongSession.create({
            sessionId,
            userId,
            items,
            remark,
            amount,
            currency: currency || 'usd',
            qrString: qrResult.qrString,
            md5: qrResult.md5,
            status: 'pending'
        });

        res.status(200).json({
            sessionId: session.sessionId,
            qrString: session.qrString,
            md5: session.md5,
            amount: session.amount,
            currency: session.currency
        });
    } catch (error) {
        console.error('[Bakong Controller] Generate Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// POST /api/bakong/check
const checkPaymentStatus = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            console.log(`[Bakong Controller] ❌ Check aborted: Empty session ID received from frontend.`);
            return res.status(400).json({ message: 'Session ID or MD5 is required.' });
        }

        const session = await BakongSession.findOne({
            $or: [{ sessionId }, { md5: sessionId }]
        });

        if (!session) {
            console.log(`[Bakong Controller] ❌ Check aborted: Session not found for ID/MD5 ${sessionId}.`);
            return res.status(404).json({ message: 'Session not found.' });
        }

        if (session.status === 'paid') {
            console.log(`[Bakong Controller] ⚠️ Request arrived for ${sessionId} but it's ALREADY PAID in DB.`);
            return res.status(200).json({ isPaid: true, message: 'Already paid.' });
        }

        console.log(`[Bakong Controller] ⏳ Contacting Bakong API for ${session.md5}...`);
        const verification = await verifyPayment(session.md5);
        if (verification.isPaid) {
            session.status = 'paid';
            await session.save();

            const mongoose = require('mongoose');
            const newSaleId = new mongoose.Types.ObjectId();

            const saleItemsIds = [];
            for (const item of session.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    const price = product.price || 0;
                    const totalPrice = price * item.quantity;

                    const newSaleItem = await SaleItem.create({
                        saleId: newSaleId,
                        productId: item.productId,
                        categoryId: item.categoryId || product.categoryId,
                        quantity: item.quantity,
                        price,
                        totalPrice,
                        remarks: item.remarks || '',
                    });
                    saleItemsIds.push(newSaleItem._id);

                    product.stockQuantity -= item.quantity;
                    await product.save();
                }
            }

            const newSale = await Sale.create({
                _id: newSaleId,
                userId: session.userId,
                paymentType: 'qr',
                salePrice: session.amount,
                remark: session.remark,
                saleItemId: saleItemsIds
            });

            const populatedSale = await Sale.findById(newSaleId).populate({
                path: 'saleItemId',
                populate: { path: 'productId', select: 'productName price img' }
            }).populate('userId', 'userName role');

            return res.status(200).json({ isPaid: true, message: 'Payment confirmed & Sale created.', sale: populatedSale });
        }

        res.status(200).json({ isPaid: false, message: 'Payment not yet received.' });
    } catch (error) {
        console.error('[Bakong Controller] Check Error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { generateQRCode, checkPaymentStatus };
