const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    phaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phase",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please provide the task title"],
    },
    description: {
        type: String,
        required: [true, "Please provide the task description"],
    },
    assignee: {
        type: String,
        required: [true, "Please provide the assignee"],
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Done"],
        default: "To Do",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    dueDate: {
        type: Date,
        required: [true, "Please provide the task due date"],
    },
    comments: [
        {
            commenter: String,
            comment: String,
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

TaskSchema.pre("find", skipDeleted);
TaskSchema.pre("findOne", skipDeleted);
TaskSchema.pre("findById", skipDeleted);
TaskSchema.pre("updateOne", skipDeleted);
TaskSchema.pre("updateMany", skipDeleted);
TaskSchema.pre("findOneAndUpdate", skipDeleted);
TaskSchema.pre("deleteOne", skipDeleted);
TaskSchema.pre("deleteMany", skipDeleted);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
