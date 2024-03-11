const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        trim: true,
    },
    staffId: {
        type: String,
        trim: true,
        required: true,
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    house_Address: {
        type:String,
        trim:true
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
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

const Manager = mongoose.model('Manager', ManagerSchema);

module.exports = Manager;
