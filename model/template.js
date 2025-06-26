const mongoose = require("mongoose");

const template = new mongoose.Schema({
    jobTitle: { type: String, required: true }, // e.g., "React Developer"
    subject: { type: String, required: true }, // Email Subject
    body: { type: String, required: true }, // Email Body with placeholders
    placeholders: { type: [String], default: [] }, // Placeholder keys like ["companyName", "portfolioLink"]
});

module.exports = mongoose.model("EmailTemplate", template);
