const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the project name"],
    },
    description: {
        type: String,
        required: [true, "Please provide the project description"],
    },
    startDate: {
        type: Date,
        required: [false, "Please provide the project start date"],
    },
    endDate: {
        type: Date,
        required: [false, "Please provide the project end date"],
    },
    status: {
        type: String,
        enum: ["Planned", "In Progress", "Completed", "On Hold"],
        default: "Planned",
    },
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the project manager"],
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
    dateUpdated: {
        type: Date,
        default: Date.now,
    },
});

const skipDeleted = function () {
    this.where({ isDeleted: false });
};

// Apply the pre hooks to filter out deleted documents
ProjectSchema.pre("find", skipDeleted);
ProjectSchema.pre("findOne", skipDeleted);
ProjectSchema.pre("findById", skipDeleted);
ProjectSchema.pre("updateOne", skipDeleted);
ProjectSchema.pre("updateMany", skipDeleted);
ProjectSchema.pre("findOneAndUpdate", skipDeleted);
ProjectSchema.pre("deleteOne", skipDeleted);
ProjectSchema.pre("deleteMany", skipDeleted);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
