const router = require("express").Router();
const routeTrackController = require("../controllers/routeTrack.controller");

router.post("/", routeTrackController.createRouteTrack);
router.get("/:routeId", routeTrackController.getRouteTrack);
router.delete("/:routeId", routeTrackController.deleteRouteTrack);

module.exports = router;
