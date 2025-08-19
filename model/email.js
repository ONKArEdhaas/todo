const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    template_name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }, userID: {
        type: String,
        required: true // It's good practice to add validation
    }
}, {
    timestamps: true
});

// Create the model from the schema
const Template = mongoose.model('ETemplate', templateSchema);

module.exports = Template;