const utilities = require("../utilities")
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let navHtml = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      navHtml,
    })
  }
  
  module.exports = { buildLogin }