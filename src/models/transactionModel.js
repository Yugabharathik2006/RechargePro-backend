const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    operator: {
        name: { type: String, required: true },
        logo: { type: String }
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed",
    },
    plan: {
        validity: String,
        data: String,
        calls: String,
        features: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);