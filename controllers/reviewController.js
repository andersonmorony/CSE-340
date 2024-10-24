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

module.exports = revController;
