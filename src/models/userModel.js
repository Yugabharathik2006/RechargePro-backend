const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: function () {
            // Phone is required only for non-Google signups
            return !this.googleId;
        },
    },
    password: {
        type: String,
        required: function () {
            // Password is required only for non-Google signups
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
    },
    avatar: {
        type: String,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);