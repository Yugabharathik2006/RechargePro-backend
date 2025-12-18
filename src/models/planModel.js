const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    operator: {
        type: String,
        required: true,
        enum: ['Airtel', 'Jio', 'Vi', 'BSNL', 'airtel', 'jio', 'vi', 'bsnl'] // Allowing both cases for now to match frontend data
    },
    price: {
        type: Number,
        required: true
    },
    validity: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    calls: {
        type: String,
        default: 'Unlimited'
    },
    sms: {
        type: String,
        default: '100/Day'
    },
    description: {
        type: String
    },
    features: [{
        type: String
    }],
    category: {
        type: String,
        default: 'popular'
    },
    popular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plan', planSchema);
