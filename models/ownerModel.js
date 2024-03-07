const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true,
    },
    uniqueCode: {
        type: String,
        trim: true,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    House_No: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String, // Use String for enum
        enum: ['male', 'female', 'others'], // Specify allowed values as an array
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    cattles:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cattle'
    }]
}, { timestamps: true });

const Owner = mongoose.model('owner', ownerSchema);

module.exports = Owner;
