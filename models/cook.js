const mongoose = require('mongoose');

const cookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: String,
    bio: String,
    address: {
        type: String,
        required: true
    },
        title: {
            type: String,
        },
        price: {
            type: Number,
        
        },
    
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}, { timestamps: true });

module.exports = mongoose.model('Cook', cookSchema);
