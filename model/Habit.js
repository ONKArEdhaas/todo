const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { _id: false }); // No _id for subdocuments

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    icon: {
        type: String,
        required: true
    },
    completions: {
        type: [completionSchema],
        default: []
    }
}, {
    timestamps: true
});

// Ensure each user can use each icon only once
habitSchema.index({ userId: 1, icon: 1 }, { unique: true });

// Optional: better query performance for date range queries
habitSchema.index({ userId: 1, "completions.date": 1 });

module.exports = mongoose.model('Habit', habitSchema);