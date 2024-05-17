const router = require("express").Router();
const itineraryController = require("../controllers/itinerary.controller");

router.get("/:itineraryId", itineraryController.getItineraryById);
router.get("/driver/:driverId", itineraryController.getItinerariesByDriver);
router.get(
    "/passenger/:passengerId",
    itineraryController.getItinerariesByPassenger
);
router.post("/", itineraryController.createItinerary);
router.patch("/addPassenger", itineraryController.addPassengerToItinerary);
router.patch(
    "/removePassenger",
    itineraryController.removePassengerFromItinerary
);
router.patch("/addStopover", itineraryController.addStopoverToItinerary);
router.patch(
    "/removeStopover",
    itineraryController.removeStopoverFromItinerary
);
router.patch("/complete", itineraryController.completeItinerary);
router.patch("/cancel", itineraryController.cancelItinerary);

module.exports = router;
