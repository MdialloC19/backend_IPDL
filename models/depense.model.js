const mongoose = require("mongoose");

const DepenseSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    phaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phase",
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        required: [true, "Please provide the expense description"],
    },
    amount: {
        type: Number,
        required: [true, "Please provide the expense amount"],
    },
    date: {
        type: Date,
        required: [true, "Please provide the expense date"],
        default: Date.now,
    },
    category: {
        type: String,
        required: [true, "Please provide the expense category"],
    },
    createdBy: {
        type: String,
        required: [true, "Please provide the creator of the expense"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

const skipDeleted = function () {
    this.where({ isDeleted: false });
};

// Apply the pre hooks to filter out deleted documents
DepenseSchema.pre("find", skipDeleted);
DepenseSchema.pre("findOne", skipDeleted);
DepenseSchema.pre("findById", skipDeleted);
DepenseSchema.pre("updateOne", skipDeleted);
DepenseSchema.pre("updateMany", skipDeleted);
DepenseSchema.pre("findOneAndUpdate", skipDeleted);
DepenseSchema.pre("deleteOne", skipDeleted);
DepenseSchema.pre("deleteMany", skipDeleted);

const Depense = mongoose.model("Depense", DepenseSchema);
module.exports = Depense;
