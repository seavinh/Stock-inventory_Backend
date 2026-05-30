const mongoose = require('mongoose');
const User = require('./models/usersModel');

mongoose.connect('mongodb://127.0.0.1:27017/InventoryManagementSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log("Connected to MongoDB for Seeding");

    const adminExists = await User.findOne({ userName: 'admin' });
    if (!adminExists) {
        await User.create({
            userName: 'admin',
            password: 'password123', // Will be hashed by pre-save hook
            phoneNumber: '1234567890',
            role: 'admin',
            isActive: true
        });
        console.log("✅ Default Admin User created: username: 'admin', password: 'password123'");
    } else {
        console.log("Admin user already exists.");
    }
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
