const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let navHtml = await utilities.getNav()
  const className = data ? data[0]?.classification_name + "vehicles" : 'Classification not found.'
  res.render("./inventory/classification", {
    title: className,
    navHtml,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventory_id;
  const data = await invModel.getInventoryById(inventory_id)
  const grid = utilities.buildInventoryDetails(data);
  let navHtml = await utilities.getNav()
  const title = data ? `${data?.inv_make} ${data?.inv_model}` : 'Car not found.'
  res.render("./inventory/details", {
    title,
    navHtml,
    grid
  })
}

module.exports = invCont