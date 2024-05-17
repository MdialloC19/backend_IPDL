const router = require("express").Router();
const reviewController = require("../controllers/review.controller");

router.get("/:userId", reviewController.getReviewsByUser);

router.post("/", reviewController.addReview);

module.exports = router;
