const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

router.get("/login", accountController.buildLogin);
router.get("/singup", accountController.buildRegister);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkRegLoginDdata,
  accountController.accountLogin
)

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//default router
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountLoged))

// update account
router.get("/update-account/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccountData));

// update account
router.post("/update-account/",
  utilities.checkLogin,
   regValidate.registationRulesUpdateInformations(),
   regValidate.checkRegLoginDataUpdate,
   utilities.handleErrors(accountController.updateAccountData));

   // update account
router.post("/update-account-password/",
  utilities.checkLogin,
   regValidate.registationRulesUpdatePassword(),
   regValidate.checkRegLoginDataUpdate,
   utilities.handleErrors(accountController.updateAccountPassword));

// logout
router.get("/logout",
  utilities.checkLogin,
 utilities.handleErrors(accountController.Logout))

module.exports = router;
