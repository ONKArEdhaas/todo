const asyncHandler = require('express-async-handler');
const Task = require('../model/taskData');

exports.addTaskData = asyncHandler(async (req, res) => {
    console.log(req.body); // Log the incoming request body
    const { title, category } = req.body;

    if (!title || !category) {
        return res.status(400).json({ message: "Title and category are required." });
    }

    try {
        const product = new Task({ title, category });
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

exports.getAllTasks = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch all tasks from the database
        res.status(200).json(tasks); // Return the tasks as JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
});


exports.getTaskById = asyncHandler(async (req, res) => {
    try {
        const task = await Task.findById(req.params.id); // Find the task by ID

        if (!task) {
            return res.status(404).json({ message: "Task not found" }); // Handle case where task does not exist
        }

        res.status(200).json(task); // Return the task as JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
});

exports.updateTaskData = asyncHandler(async (req, res) => {
    const { title, category, description } = req.body; // Destructure request body

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, category, description },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" }); // Handle case where task does not exist
        }

        res.status(200).json(task); // Return the updated task as JSON
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
});

exports.deleteTaskData = asyncHandler(async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id); // Delete the task by ID

        if (!task) {
            return res.status(404).json({ message: "Task not found" }); // Handle case where task does not exist
        }

        res.status(200).json({ message: "Task deleted successfully" }); // Confirmation message
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle errors
    }
});
// exports.deleteTaskData = asyncHandler(async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id); // Delete the task by ID

//         if (!task) {
//             return res.status(404).json({ message: "Task not found" }); // Handle case where task does not exist
//         }

//         res.status(200).json({ message: "Task deleted successfully" }); // Confirmation message
//     } catch (err) {
//         res.status(500).json({ message: err.message }); // Handle errors
//     }
// });