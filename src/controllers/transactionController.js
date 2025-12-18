const Transaction = require("../models/transactionModel");

// Create Transaction
exports.createTransaction = async (req, res) => {
    try {
        const { operator, mobileNumber, amount, paymentMethod, transactionId, plan } = req.body;

        // Assuming user ID is available in req.user from auth middleware
        // If not using auth middleware yet, we might need to pass userId in body (less secure)
        // For now, let's assume we'll add auth middleware
        const userId = req.user ? req.user.id : req.body.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const newTransaction = new Transaction({
            user: userId,
            operator,
            mobileNumber,
            amount,
            paymentMethod,
            transactionId,
            status: 'completed', // Simulating instant success
            plan
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get User Transactions
exports.getUserTransactions = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.query.userId;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};