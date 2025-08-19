const asyncHandler = require('express-async-handler');
const Template = require('../model/email');

// Create a new email template
exports.addEmail = asyncHandler(async (req, res) => {
    const { template_name, role, desc, userID } = req.body;

    if (!template_name || !role || !desc) {
        return res.status(400).json({ message: "Template name, role, and description are required." });
    }

    try {
        const template = new Template({ template_name, role, desc, userID });
        const newTemplate = await template.save();
        res.status(201).json(newTemplate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all email templates
exports.getAllEmails = asyncHandler(async (req, res) => {
    try {
        const auth = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer auth
        if (!auth) {
            return res.status(400).json({ message: 'auth is required' });
        }
        const templates = await Template.find({ userID: auth });
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get email templates with selected fields
exports.getTemplateID = asyncHandler(async (req, res) => {
    try {
        const templates = await Template.find({}).select('template_name');
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get single email template by ID
exports.getEmailById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const template = await Template.findById(id);

        if (!template) {
            return res.status(404).json({ message: "Email template not found" });
        }

        res.status(200).json(template);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an email template
exports.updateEmail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { template_name, role, desc } = req.body;

    if (!template_name || !role || !desc) {
        return res.status(400).json({ message: "Template name, role, and description are required." });
    }

    try {
        const updatedTemplate = await Template.findByIdAndUpdate(
            id,
            { template_name, role, desc },
            { new: true, runValidators: true }
        );

        if (!updatedTemplate) {
            return res.status(404).json({ message: "Email template not found" });
        }

        res.status(200).json(updatedTemplate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an email template
exports.deleteEmail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const auth = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer auth
        if (!auth) {
            return res.status(400).json({ message: 'auth is required' });
        }
        const deletedTemplate = await Template.findByIdAndDelete(id);

        if (!deletedTemplate) {
            return res.status(404).json({ message: "Email template not found" });
        }

        res.status(200).json({ message: "Email template deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});