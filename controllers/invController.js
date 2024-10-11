const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let navHtml = await utilities.getNav();
  const className = data
    ? data[0]?.classification_name + " vehicles"
    : "Classification type not found.";
  res.render("./inventory/classification", {
    title: className,
    navHtml,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventory_id;
  const data = await invModel.getInventoryById(inventory_id);
  const grid = utilities.buildInventoryDetails(data);
  let navHtml = await utilities.getNav();
  const title = data
    ? `${data?.inv_make} ${data?.inv_model}`
    : "Car not found.";
  res.render("./inventory/details", {
    title,
    navHtml,
    grid,
  });
};

// management
invCont.buildManagementView = async function (req, res, next) {
  let navHtml = await utilities.getNav();
  const title = "Management";
  res.render("./inventory/management", {
    title,
    navHtml,
    errors: null
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let navHtml = await utilities.getNav();
  const title = "Add New Classification";
  res.render("./inventory/add-classification", {
    title,
    navHtml,
    errors: null
  });
};

invCont.CreateClassification = async function (req, res, next) {
  let navHtml = await utilities.getNav()

  const { classification_name } = req.body
  const result = await invModel.CreateClassification(classification_name);
 
  if (result?.rowCount && result.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name} was created.`
    );
    res.status(201).render("./inventory/management", {
      title: "Management",
      navHtml,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/management", {
      title: "Management",
      navHtml,
      errors: null,
    });
  }
};


// Add inventory
invCont.buildAddInventory = async function(req, res, next) {
  const navHtml = await utilities.getNav()
  const selectElement = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add new inventory",
    navHtml,
    errors: null,
    selectElement
  })
}

invCont.CreateInventory = async function(req, res, next) {
  let navHtml = await utilities.getNav();
  const selectElement = await utilities.buildClassificationList();
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

  const result = await invModel.CreateInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id);

    if(result) {
      req.flash(
        "notice",
        `Congratulations, ${inv_make} was created.`
      );
      res.status(201).render("./inventory/management", {
        title: "Management",
        navHtml,
        errors: null,
        selectElement,
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("./inventory/management", {
        title: "Management",
        navHtml,
        errors: null,
        selectElement
      });
    }
}

module.exports = invCont;
