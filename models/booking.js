const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cook: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },

        title: {
            type: String,
           
        },
        price: {
            type: Number,
        },
  
    address: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    timeSlot: {
        type: String,
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
