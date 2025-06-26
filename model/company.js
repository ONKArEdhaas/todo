const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    origin: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['MNC', 'Startup', 'Y Combinator', 'Established', 'Mid Level'],
        required: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    userID: {
        type: String,
        required: true // It's good practice to add validation
    }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
