const mongoose = require("mongoose");
const enumUsersRoles = require("../utils/enums/enumUserRoles");

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [false, "Please give the firstname"],
    },
    lastname: {
        type: String,
        required: [false, "Please give the lastname"],
    },
    dateofbirth: {
        type: Date,
        required: [false, "Please give the date of birth"],
    },
    nationality: {
        type: String,
        required: [false, "Please give the nationality"],
    },
    sexe: {
        type: String,
        required: [false, "Please give thesexe"],
        enum: ["M", "F"],
    },
    role: {
        type: String,
        enum: Object.values(enumUsersRoles),
        default: enumUsersRoles.PASSENGER,
    },
    secret: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

const skipDeleted = function () {
    this.where({ isDeleted: false });
};

UserSchema.pre("find", skipDeleted);
UserSchema.pre("findOne", skipDeleted);
UserSchema.pre("findById", skipDeleted);
UserSchema.pre("updateOne", skipDeleted);
UserSchema.pre("updateMany", skipDeleted);
UserSchema.pre("findOneAndUpdate", skipDeleted);
UserSchema.pre("deleteOne", skipDeleted);
UserSchema.pre("deleteMany", skipDeleted);

const User = mongoose.model("user", UserSchema);
module.exports = User;
