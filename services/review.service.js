const Review = require("../models/review.model");
const HttpError = require("../utils/execptions");

/**
 * Service class for managing reviews.
 */
class ReviewService {
  /**
   * Validates a review.
   * @param {Object} reviewData - The data for the review.
   * @param {string} reviewData.reviewer - The ID of the reviewer.
   * @param {string} reviewData.reviewee - The ID of the reviewee.
   * @param {number} reviewData.rating - The rating given in the review.
   * @param {string} reviewData.comment - The comment provided in the review.
   * @returns {boolean} - True if the review is valid, false otherwise.
   */
  static validateReview({ reviewer, reviewee, rating, comment }) {
    if (!reviewer || !reviewee || !rating || !comment) {
      return false;
    }

    if (
      typeof reviewer !== "string" ||
      typeof reviewee !== "string" ||
      typeof rating !== "number" ||
      typeof comment !== "string"
    ) {
      return false;
    }
    if (comment.trim() === "") {
      return false;
    }
    return true;
  }

  /**
   * Adds a new review.
   * @param {Object} reviewData - The data for the review.
   * @param {string} reviewData.reviewer - The ID of the reviewer.
   * @param {string} reviewData.reviewee - The ID of the reviewee.
   * @param {number} reviewData.rating - The rating given in the review.
   * @param {string} reviewData.comment - The comment provided in the review.
   * @returns {Promise<Object>} - The newly created review.
   */
  static async addReview({ reviewer, reviewee, rating, comment }) {
    try {
      if (
        ReviewService.validateReview({
          reviewer,
          reviewee,
          rating,
          comment,
        }) === false
      )
        throw new HttpError(null, 400, "Invalid review data");
      const review = new Review({ reviewer, reviewee, rating, comment });
      await review.save();

      return review;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      else if (err.name === "ValidationError") {
        throw new HttpError(null, 400, err.message);
      } else {
        throw new HttpError(null, 500, err.message);
      }
    }
  }

  /**
   * Retrieves all reviews for a given user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<Object>>} - An array of reviews for the user.
   */
  static async getReviewsByUser(userId) {
    return Review.find({ reviewee: userId }).populate("reviewer", "username");
  }
}

module.exports = ReviewService;
