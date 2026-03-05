const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

const protect = async (req, res, next) => {
    let token;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // DYNAMIC LOGIN & ACTIVE CHECK: 
            // If the user's account was disabled by admin while they hold a local token, instantly block their requests.
            if (req.user.isActive === false) {
                return res.status(403).json({ message: 'Your account has been disabled. Please contact the admin.' });
            }

            return next();
        }

        return res.status(401).json({ message: 'Not authorized, no token' });

    } catch (error) {
        console.error('❌ Auth error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };