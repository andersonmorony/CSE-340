const invModel = require("../models/inventory-model");
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
