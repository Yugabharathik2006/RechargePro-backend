require('dotenv').config(); // Load env vars FIRST

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
require('./config/passport'); // Initialize passport strategies
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const planRoutes = require('./routes/planRoutes');
const supportRoutes = require('./routes/supportRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/plans', planRoutes);
app.use('/support', supportRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
