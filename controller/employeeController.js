const asyncHandler = require('express-async-handler');
const Employee = require('../model/employee');

// Create a new employee
exports.addEmployee = asyncHandler(async (req, res) => {
    const { name, phone, email, company, position, linkedin, userID } = req.body;

    if (!name || !email || !company) {
        return res.status(400).json({ message: "Name, email, and company are required." });
    }

    try {
        const employee = new Employee({ name, phone, email, company, position, linkedin, userID });
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all employees
exports.getAllEmployees = asyncHandler(async (req, res) => {
    try {
        const auth = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer auth
        if (!auth) {
            return res.status(400).json({ message: 'auth is required' });
        }
        console.log(auth);
        const employees = await Employee.find({ userID: auth });
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get employees with selected fields
exports.getFilteredEmployees = asyncHandler(async (req, res) => {
    try {
        const auth = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer auth
        if (!auth) {
            return res.status(400).json({ message: 'auth is required' });
        }
        console.log(auth);
        const employees = await Employee.find({ userID: auth }).select('name position company linkedin email');
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an employee
exports.updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, company, position, linkedin } = req.body;

    if (!name || !email || !company) {
        return res.status(400).json({ message: "Name, email, and company are required." });
    }



    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { name, phone, email, company, position, linkedin },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete an employee
exports.deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
