const Conversation = require("../models/conversation.model");

exports.getMessagesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Conversation.find({ roomId }).populate({
            path: "userId",
            select: ["firstname", "lastname", "phone"],
        });

        const updatedMessages = messages.map((message) => {
            const messageObject = message.toObject();
            messageObject.username = (
                (messageObject.userId.firstname || "") +
                " " +
                (messageObject.userId.lastname || "")
            ).trim();
            // messageObject.user = messageObject.userId;
            messageObject.userId = messageObject.userId._id;
            message.from = messageObject.userId;
            return messageObject;
        });

        res.status(200).json(updatedMessages || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
