const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const navHtml = await utilities.getNav()
  res.render("index", {title: "Home", navHtml})
}

module.exports = baseController