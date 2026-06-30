require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

//Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/InventoryManagementSystem')
  .then(() => console.log('Database Connected 📚 📚'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Hello ,welcome to Inventory Management System API 🚀🚀');
});

//Routes
const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/login.routes');
app.use('/api/login', authRoutes);

const authRoutesRegister = require('./routes/register.routes');
app.use('/api/register', authRoutesRegister);

const productRoutes = require('./routes/product.route');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/category.route');
app.use('/api/categories', categoryRoutes);

const supplierRoute = require('./routes/supplier.route');
app.use('/api/suppliers', supplierRoute);

const saleRoute = require('./routes/sale.route');
app.use('/api/sales', saleRoute);

const purchaseRoutes = require('./routes/purchase.route');
app.use('/api/purchases', purchaseRoutes);

const bakongRoutes = require('./routes/bakong.route');
app.use('/api/bakong', bakongRoutes);

// Kill any existing process on target port before starting


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🏃🏃`);
});
