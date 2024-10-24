const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")

// New Review
validate.addReviewRules = () => {
  return [

    body("inventory_id")
      .notEmpty()
      .withMessage("Provide a valid inventory ID")
      .isInt()
      .withMessage("inventory ID must be an integer"),

    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid review")
      .isLength({ max: 255 })
      .withMessage(
        "Make must be a string with a maximum length of 255 characters"
      ),
  ];
};

validate.updateReviewRules = () => {
  return [
    body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid review")
      .isLength({ max: 255 })
      .withMessage(
        "Make must be a string with a maximum length of 255 characters"
      ),
  ];
};

validate.checkAddReview = async (req, res, next) => {
  const { inventory_id, review_text } = req.body;
  const data = await invModel.getInventoryById(inventory_id);
  const grid = utilities.buildInventoryDetails(data);
  const reviewGrid = await utilities.buildReviewGrid(inventory_id)

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let navHtml = await utilities.getNav();
    res.render("./inventory/details", {
      errors,
      grid,
      navHtml,
      title: `${data?.inv_make} ${data?.inv_model}`,
      review_text,
      inventory_id,
      reviewGrid
    });
    return;
  }
  next();
};


validate.checkUpdateReview = async (req, res, next) => {
  const { review_text, review_id } = req.body;
  
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let navHtml = await utilities.getNav();
    const {inv_make, inv_model, inv_year, review_date } = await reviewModel.getReviewByInvId(review_id)
    const title = `Edit the  ${inv_year} ${inv_make} ${inv_model} review`
    res.render("./review/edit-review", {
      errors,
      navHtml,
      title,
      review_text,
      review_id,
      review_dateFormated: utilities.formatDate(review_date)
    });
    return;
  }
  next();
};

module.exports = validate;
