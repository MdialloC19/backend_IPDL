const mongoose = require("mongoose");

const PhaseSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Please provide the phase name"],
    },
    description: {
        type: String,
        required: [true, "Please provide the phase description"],
    },
    startDate: {
        type: Date,
        required: [true, "Please provide the phase start date"],
    },
    endDate: {
        type: Date,
        required: [true, "Please provide the phase end date"],
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
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

PhaseSchema.pre("find", skipDeleted);
PhaseSchema.pre("findOne", skipDeleted);
PhaseSchema.pre("findById", skipDeleted);
PhaseSchema.pre("updateOne", skipDeleted);
PhaseSchema.pre("updateMany", skipDeleted);
PhaseSchema.pre("findOneAndUpdate", skipDeleted);
PhaseSchema.pre("deleteOne", skipDeleted);
PhaseSchema.pre("deleteMany", skipDeleted);

const Phase = mongoose.model("Phase", PhaseSchema);
module.exports = Phase;
