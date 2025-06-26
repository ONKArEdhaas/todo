const asyncHandler = require('express-async-handler');
const Company = require('../model/company');

// Create a new company
exports.addCompany = asyncHandler(async (req, res) => {
    const { name, origin, type, country, location, userID } = req.body;

    if (!name || !origin || !type || !country || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const company = new Company({ name, origin, type, country, location, userID });
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



exports.getAllCompanies = asyncHandler(async (req, res) => {
    try {
        const auth = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer auth
        if (!auth) {
            return res.status(400).json({ message: 'auth is required' });
        }
        console.log(auth);
        const companies = await Company.find({ userID: auth });
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

exports.getCompanyNames = asyncHandler(async (req, res) => {
    try {
        const companyNames = await Company.find().select('name -_id');
        res.status(200).json(companyNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


exports.updateCompany = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, origin, type, country, location } = req.body;

    if (!name || !origin || !type || !country || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            { name, origin, type, country, location },
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json(updatedCompany);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

exports.deleteCompany = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCompany = await Company.findByIdAndDelete(id);

        if (!deletedCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ message: "Company deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
