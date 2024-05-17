const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;
