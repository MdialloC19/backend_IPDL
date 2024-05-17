const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
router.use("/user", userRoutes);
// convos
router.use("/conversation", conversationRoutes);

module.exports = router;
