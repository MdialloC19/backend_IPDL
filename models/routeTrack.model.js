const mongoose = require("mongoose");

const routeTrackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    routeId: {
        type: String,
        required: true,
        unique: true,
    },
    isExpired: {
        type: Boolean,
        default: false,
    },
});

const RouteTrack = mongoose.model("RouteTrack", routeTrackSchema);
module.exports = RouteTrack;
