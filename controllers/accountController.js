const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { render } = require("ejs")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let navHtml = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      navHtml,
      errors: null,
    })
  }

  

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let navHtml = await utilities.getNav()
  res.render("account/singup", {
    title: "Register",
    navHtml,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let navHtml = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/singup", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

    if (regResult?.rowCount && regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      navHtml,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/singup", {
      title: "Registration",
      navHtml,
      errors: null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let navHtml = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("/account/login", {
      title: "Login",
      navHtml,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        navHtml,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Default loged view
* *************************************** */
async function accountLoged(req, res, next) {
  let navHtml = await utilities.getNav()
  res.render("account/index", {
    title: "Home",
    navHtml,
    errors: null
  })
}

async function buildUpdateAccountData(req, res, next) {
  let navHtml = await utilities.getNav()
  const { account_id } = req.params;
  const accountData = await accountModel.getAccountById(account_id)
  const {account_firstname, account_lastname, account_email} = accountData
  if(accountData){
    res.render('./account/update', {
      title: "Update Account",
      navHtml,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

async function updateAccountData(req, res, next) {
  let navHtml = await utilities.getNav();
  const {account_firstname, account_lastname, account_email} = req.body;
  const account_id = parseInt(req.body.account_id)


  if(res.locals.accountData && res.locals.accountData.account_id !== account_id) {
    req.flash("notice", "Account Id invalid");
    res.render('./account/update', {
      title: "Update Account",
      navHtml,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }

  const accountUpdated = await accountModel.updateAccountById(account_firstname, account_lastname, account_email, account_id);
  if(accountUpdated) {
    const {account_firstname, account_lastname, account_email, account_id} = accountUpdated;
    req.flash("notice", "Account updated success");
    res.render('./account/update', {
      title: "Update Account",
      navHtml,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  } else {
    req.flash("notice", "Sorry, the updated failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Update Account",
    navHtml,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}
  
// Update Account Password

async function updateAccountPassword(req, res, next) {
  let navHtml = await utilities.getNav();
  const {account_password} = req.body;
  const account_id = parseInt(req.body.account_id);

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/singup", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  // Verify if id is equal
  if(res.locals.accountData && res.locals.accountData.account_id !== account_id) {
    req.flash("notice", "Account Id invalid");
    res.render('./account/update', {
      title: "Update Account",
      navHtml,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }

  const passwordUpdated = await accountModel.updateAccounPasswordtById(account_id, hashedPassword);
  if(passwordUpdated) {
    const {account_firstname, account_lastname, account_email, account_id} = passwordUpdated;
    req.flash("notice", "Account updated success");
    res.render('./account/update', {
      title: "Update Account",
      navHtml,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  } else {
    req.flash("notice", "Sorry, the updated failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Update Account",
    navHtml,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

async function Logout(req, res, next) {
  let navHtml = await utilities.getNav();
  req.flash("notice", "Logout with success!")
  res.clearCookie("jwt")
  res.locals.accountData = null
  res.locals.loggedin = false
  res.render("index", {
    title: "Home",
    navHtml
  })
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountLoged,
  buildUpdateAccountData,
  updateAccountData,
  updateAccountPassword,
  Logout
};
