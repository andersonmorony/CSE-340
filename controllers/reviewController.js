const reviewModel = require("../models/review-model");
const utilities = require("../utilities/index");
const invModel = require("../models/inventory-model");
const revController = {};

revController.saveReview = async (req, res, next) => {
    const { review_text, inventory_id } = req.body;
    const account_id = res.locals.accountData.account_id;
    const result = await reviewModel.addReview(
        review_text,
        inventory_id,
        account_id
    );
    
    if (result) {
        req.flash("notice", "Review added");
        res.redirect("/inv/detail/" + inventory_id);
        return;
    }
    
  let navHtml = await utilities.getNav();
  const data = await invModel.getInventoryById(inventory_id);
  const grid = utilities.buildInventoryDetails(data);
  const reviewGrid = await utilities.buildReviewGrid(inventory_id)
  req.flash("notice", "Sorry, the registration failed.");
  const title = data
    ? `${data?.inv_make} ${data?.inv_model}`
    : "Car not found.";
  res.render("./inventory/details", {
    title,
    navHtml,
    grid,
    inventory_id,
    review_text,
    reviewGrid
  });
};

revController.builUpdateHtml = async (req, res, next) => {
  const navHtml = await utilities.getNav();
  const { review_id } = req.params;
  const {review_text, inv_make, inv_model, inv_year, review_date } = await reviewModel.getReviewByInvId(review_id)
  const title = `Edit the  ${inv_year} ${inv_make} ${inv_model} review`
  res.render("./review/edit-review", {
    title,
    navHtml,
    review_text,
    review_id,
    review_dateFormated: utilities.formatDate(review_date),
    errors: null
  });
}

revController.updateReview = async(req, res, next) => {
  const { review_text, review_id } = req.body;
  const result = await reviewModel.updateReview(review_id, review_text);
  if(result) {
    req.flash("notice", "Review updated");
    res.redirect("/review/edit/" + review_id);
    return;
  }
  
  req.flash("notice", "Sorry, the updated failed.");
  const navHtml = await utilities.getNav();
  const {inv_make, inv_model, inv_year, review_date } = await reviewModel.getReviewByInvId(review_id)
  const title = `Edit the  ${inv_year} ${inv_make} ${inv_model} review`
  res.render("./review/edit-review", {
    title,
    navHtml,
    review_text,
    review_id,
    review_dateFormated: utilities.formatDate(review_date),
    errors: null
  });

}

module.exports = revController;
