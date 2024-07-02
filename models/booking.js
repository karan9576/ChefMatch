const mongoose = require('mongoose');
const User=require("./user");

const Cook=require("./cook");

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
    service: {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
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
    totalPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
