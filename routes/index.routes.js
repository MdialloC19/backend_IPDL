const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const conversationRoutes = require("./conversation.routes");
const reviewRoutes = require("./review.routes");
const intineraryRoutes = require("./itinerary.routes");
router.use("/user", userRoutes);
// convos
router.use("/conversation", conversationRoutes);
router.use("/review", reviewRoutes);
router.use("/itinerary", intineraryRoutes);
module.exports = router;
