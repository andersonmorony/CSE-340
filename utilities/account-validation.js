const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if(emailExists) {
          throw new Error("Email exists. please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let navHtml = await utilities.getNav()
      res.render("account/singup", {
        errors,
        title: "Registration",
        navHtml,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

  /*  **********************************
  *  login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [

    // Email
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail().normalizeEmail()
    .withMessage("Please provide an email valid."),

    // Password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
  ]
}

validate.checkRegLoginDdata = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()) {
    let navHtml = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      navHtml,
      account_email
    })
  }
}
  
  module.exports = validate