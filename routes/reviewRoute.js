const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const validate = require("../utilities/review-validation");
const utilities = require("../utilities/index");

router.post(
  "/review-add",
  utilities.checkLogin,
  validate.addReviewRules(),
  validate.checkAddReview,
  utilities.handleErrors(reviewController.saveReview)
);

module.exports = router;
