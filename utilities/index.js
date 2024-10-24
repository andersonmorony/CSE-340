const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildInventoryDetails = function (data) {
  let grid;
  if (data) {
    grid = `
      <div id="inventory-details">
          <div class="detail-image">
              <img src="${data.inv_image}" alt="${data.inv_model}" srcset="">
          </div>
          <div class="content-details">
              <div class="header">
                  <h1>${data.inv_model}</h1>
                  <h2>$${Number(data.inv_price).toLocaleString()}</h2>
                  <p>${data.inv_description}</p>
              </div>
              <div class="details">
                  <h3>Details</h3>
                  <table>
                    <tr>
                        <td><b>Miles</b></td>
                        <td>${Number(data.inv_miles).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><b>Color</b></td>
                        <td>${data.inv_color}</td>
                    </tr>
                    <tr>
                        <td><b>Year</b></td>
                        <td>${data.inv_year}</td>
                    </tr>
                    <tr>
                        <td><b>Classification</b></td>
                        <td><a href="/inv/type/${data.classification_id}">${data.classification_name}</a></td>
                    </tr>
                </table>
              </div>
          </div>
      </div>
    `;
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select class="form-control" name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      res.locals.accountData = null
      res.locals.loggedin = false
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
    res.locals.accountData = null
    res.locals.loggedin = false
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) { 
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.onlyEmpoyeeAdmin = (req, res, next) => {
  if(res.locals.accountData && res.locals.accountData.account_type !== 'Client') {
    next()
  } else {
    req.flash("notice","This must NOT be used when delivering the classification or detail views as they are meant for site visitors who may not be logged in.")
    return res.redirect("/account/login")
  }
 }

/* **************************************
 * Build the review view HTML
 * ************************************ */
Util.buildReviewGrid = async (inv_id) => {
  const reviews = await reviewModel.getReviewByInvId(inv_id);
  const items = reviews.map((review) => {
    return `
      <li>
        ${review.account_firstname} wrote on ${Util.formatDate(review.review_date)}
        <p>
          ${review.review_text}
        </p>
      </li>
    `;
  }).join(''); 

  const HTML = `
      <div class="reviews">
        <h2>Customer Reviews</h2>
        <ul>${items.length > 0 ? items : "<p>Be the first to write a review</p>"}</ul>
      </div>`;
  return HTML;
}

Util.formatDate = (date) => {
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

return formattedDate;
}


/* **************************************
 * Build the review view managment
 * ************************************ */
Util.buildReviewGridOnManagement = async (account_id) => {
  const reviews = await reviewModel.getReviewByAccount_id(account_id);
  const HTML = reviews.map((review) => {
    return `
      <div class="reviews-items">
        <p>Reviewd the  ${review.inv_year} ${review.inv_make} ${review.inv_model} on ${Util.formatDate(review.review_date)}</p>
        <a href="/review/edit/${review.review_id}">Edit</a>
        <a href="/review/delete/${review.review_id}">Delete</a>
      </div>
    `;
  }).join(''); 

  return HTML;
}

Util.formatDate = (date) => {
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
});

return formattedDate;
}

module.exports = Util;
