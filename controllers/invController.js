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
  const selectElement = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title,
    navHtml,
    errors: null,
    selectElement
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let navHtml = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    navHtml,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let navHtml = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    navHtml,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



/* ***************************
 *  GET - Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let navHtml = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    navHtml,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}


/* ***************************
 *  POST - Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let navHtml = await utilities.getNav()
  const {
    inv_id,  
    inv_make,
    inv_model,
    inv_price,
    inv_year
  } = req.body
  const deleteResult = await invModel.deleteInventoryItem(
    inv_id
  )

  if (deleteResult) {
    req.flash("notice", `The car was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    navHtml,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
    })
  }
}



module.exports = invCont;
