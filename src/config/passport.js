const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

// Only configure Google strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists with this Google ID
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Check if user exists with same email
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link Google account to existing user
                        user.googleId = profile.id;
                        user.avatar = profile.photos[0]?.value || null;
                        user.authProvider = 'google';
                        await user.save();
                        return done(null, user);
                    }

                    // Create new user
                    const newUser = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0]?.value || null,
                        authProvider: 'google',
                        role: 'USER',
                    });

                    await newUser.save();
                    return done(null, newUser);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
    console.log('Google OAuth strategy configured');
} else {
    console.log('Google OAuth not configured - missing credentials in .env');
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
