const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.ClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a classification name valid"),
  ];
};

validate.checkClassificationRules = async (req, res, next) => {
  const { classification_name } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let navHtml = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      navHtml,
      title: "Add New Classification",
      classification_name,
    });
    return;
  }
  next();
};

// Inventory
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid make name")
      .isLength({ max: 255 })
      .withMessage(
        "Make must be a string with a maximum length of 255 characters"
      ),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid model name")
      .isLength({ max: 255 })
      .withMessage(
        "Model must be a string with a maximum length of 255 characters"
      ),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid year")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 characters"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid description")
      .isString()
      .withMessage("Description must be a string"),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid image URL")
      .isLength({ max: 255 })
      .withMessage(
        "Image URL must be a string with a maximum length of 255 characters"
      ),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid thumbnail URL")
      .isLength({ max: 255 })
      .withMessage(
        "Thumbnail URL must be a string with a maximum length of 255 characters"
      ),

    body("inv_price")
      .notEmpty()
      .withMessage("Provide a valid price")
      .isNumeric()
      .withMessage("Price must be a numeric value"),

    body("inv_miles")
      .notEmpty()
      .withMessage("Provide valid miles")
      .isInt({ gt: 0 })
      .withMessage("Miles must be an integer greater than 0"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Provide a valid color")
      .isLength({ max: 255 })
      .withMessage(
        "Color must be a string with a maximum length of 255 characters"
      ),

    body("classification_id")
      .notEmpty()
      .withMessage("Provide a valid classification ID")
      .isInt()
      .withMessage("Classification ID must be an integer"),
  ];
};

validate.checkInventoryRules = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let navHtml = await utilities.getNav();
    let selectElement = await utilities.buildClassificationList()
    console.log(errors)
    res.render("./inventory/add-inventory", {
      errors,
      navHtml,
      title: "Add New Classification",
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      selectElement
    });
    return;
  }
  next();
};

module.exports = validate;
