const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '7d' }
    );
};

// Google OAuth callback handler
exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = generateToken(user);

        // Redirect to frontend with token
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendURL}/auth/google/callback?token=${token}&userId=${user._id}`);
    } catch (error) {
        console.error('Google callback error:', error);
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendURL}/login?error=google_auth_failed`);
    }
};

// Google token verification (for frontend token exchange)
exports.googleTokenLogin = async (req, res) => {
    try {
        const { googleId, email, name, avatar } = req.body;

        if (!googleId || !email) {
            return res.status(400).json({ message: 'Google ID and email are required' });
        }

        // Find or create user
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check if email exists
            user = await User.findOne({ email });

            if (user) {
                // Link Google to existing account
                user.googleId = googleId;
                user.avatar = avatar || user.avatar;
                user.authProvider = 'google';
                await user.save();
            } else {
                // Create new user
                user = new User({
                    googleId,
                    email,
                    name,
                    avatar,
                    authProvider: 'google',
                    role: 'USER',
                });
                await user.save();
            }
        }

        const token = generateToken(user);

        res.json({
            message: 'Google login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                role: user.role,
                authProvider: user.authProvider,
            },
        });
    } catch (error) {
        console.error('Google token login error:', error);
        res.status(500).json({ message: 'Google authentication failed', error: error.message });
    }
};
