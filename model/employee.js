const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        // unique: true,
        lowercase: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    userID: {
        type: String,
        required: true // It's good practice to add validation
    },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
