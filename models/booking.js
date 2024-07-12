const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
        title: {
            type: String,
            required: true

        },
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true

    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending'
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
