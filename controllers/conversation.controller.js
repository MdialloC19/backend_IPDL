const Conversation = require("../models/conversation.model");

exports.getMessagesByRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Conversation.find({ roomId }).populate(
            "userId",
            "username"
        );
        res.status(200).json(messages || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
