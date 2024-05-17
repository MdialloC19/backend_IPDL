const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    // other fields like room description, createdAt, etc.
});

const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;
