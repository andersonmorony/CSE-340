const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const validate = require("../utilities/review-validation");
const utilities = require("../utilities/index");

// Add
router.post(
  "/review-add",
  utilities.checkLogin,
  validate.addReviewRules(),
  validate.checkAddReview,
  utilities.handleErrors(reviewController.saveReview)
);

// Edit
router.get("/edit/:review_id",
  utilities.checkLogin, utilities.handleErrors(reviewController.builUpdateHtml))
router.post("/edit",
  utilities.checkLogin, validate.updateReviewRules(), validate.checkUpdateReview, utilities.handleErrors(reviewController.updateReview))
router.post("/delete",
  utilities.checkLogin, validate.updateReviewRules(), validate.checkUpdateReview, utilities.handleErrors(reviewController.updateReview))


module.exports = router;
