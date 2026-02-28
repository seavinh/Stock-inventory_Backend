const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

// Generate token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// Register user controller
const registerUser = async (req, res) => {
    const { userName, password, phoneNumber } = req.body;

    try {
        const userExists = await User.findOne({ userName });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            userName,
            password,
            phoneNumber,
            role: 'staff' // 🔒 FORCE staff
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            _id: user._id,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Login user controller
const loginUser = async (req, res) => {
    const {userName, password} = req.body;
    
    try {
        // Validate input
        if (!userName || !password) {
            return res.status(400).json({
                message: 'Please provide userName and password'
            });
        }

        // Find user
        const user = await User.findOne({userName});
        
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordCorrect = await user.matchPassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response
        return res.status(200).json({
            _id: user._id,
            userName: user.userName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token: token,
        });
        
    } catch(error) {
        console.error('❌ Login error:', error);
        return res.status(500).json({message: error.message});
    }
};

module.exports = {registerUser, loginUser};