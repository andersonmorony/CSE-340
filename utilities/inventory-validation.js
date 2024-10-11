const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

validate.ClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a classification name valid"),
  ];
}

validate.checkClassificationRules = async (req, res, next) => {
    const { classification_name } = req.body

    let errors = [];
    errors = validationResult(req)
    if(!errors.isEmpty())
    {
        let navHtml = await utilities.getNav();
        res.render("./inventory/add-classification", {
            errors,
            navHtml,
            title: "Add New Classification",
            classification_name
        })
        return
    }
    next()
}

module.exports = validate
