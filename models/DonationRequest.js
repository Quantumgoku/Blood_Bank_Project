const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donor: {
        type: String,
        required: true,
    },
    receiver: {
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
    timestamp: {
        type: Number,
        required: true,
    },
    acknowledged: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Donation', DonationSchema);
