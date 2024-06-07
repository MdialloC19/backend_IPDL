const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const conversationRoutes = require("./conversation.routes");
const cardRoutes = require("./upload.routes");

router.use("/user", userRoutes);
router.use("/conversation", conversationRoutes);
router.use("/card", cardRoutes);

module.exports = router;
