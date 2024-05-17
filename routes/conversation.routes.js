const express = require("express");
const { getMessagesByRoom } = require("../controllers/conversation.controller");

const router = express.Router();

router.get("/rooms/:roomId/messages", getMessagesByRoom);

module.exports = router;
