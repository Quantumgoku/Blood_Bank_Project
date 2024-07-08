const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Request', RequestSchema);