const reviewService = require("../services/review.service");
const HttpError = require("../utils/execptions.js");

async function addReview(req, res) {
  try {
    const { reviewer, reviewee, rating, comment } = req.body;
    const review = await reviewService.addReview({
      reviewer,
      reviewee,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function getReviewsByUser(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addReview,
  getReviewsByUser,
};
