const mongoose = require("mongoose");

const taskDataSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true // It's good practice to add validation
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            required: true // It's good practice to add validation
        },
    },
    {
        timestamps: true // This option adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Task", taskDataSchema); // Ensure the model name is 'Task'
