const express = require("express");
const router = express.Router();
const userRoutes = require("./user.routes");
const conversationRoutes = require("./conversation.routes");
const reviewRoutes = require("./review.routes");
const intineraryRoutes = require("./itinerary.routes");
const routeTrackRoutes = require("./routeTrack.routes");
router.use("/user", userRoutes);
// convos
router.use("/conversation", conversationRoutes);
router.use("/review", reviewRoutes);
router.use("/itinerary", intineraryRoutes);
router.use("/routeTrack", routeTrackRoutes);
module.exports = router;
