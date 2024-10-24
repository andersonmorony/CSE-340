const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function addReview(review_text, inventory_id, account_id){
    try {
      const sql = "INSERT INTO review (inv_id, account_id, review_text) VALUES ($1, $2, $3) RETURNING *"
      const result =  await pool.query(sql, [inventory_id, account_id, review_text])
      return result.rows[0];
    } catch (error) {
      return error.message
    }
  }

  async function getReviewByInvId(inv_id) {
    try {
      const sql = "SELECT review_id, review_text, review_date, R.inv_id, R.account_id, A.account_firstname, A.account_lastname, A.account_type FROM review as R LEFT JOIN account as A ON R.account_id = A.account_id WHERE R.inv_id = $1";
      const result = await pool.query(sql, [inv_id])
      return result.rows
    } catch (error) {
      return error.message
    }
  }

  async function getReviewByAccount_id(account_id) {
    try {
      const sql = "SELECT review_id, review_text, review_date, R.inv_id, R.account_id, A.account_firstname, A.account_lastname, A.account_type, I.inv_make, I.inv_year, I.inv_model FROM review as R LEFT JOIN account as A ON R.account_id = A.account_id LEFT JOIN inventory as I ON R.inv_id = I.inv_id WHERE R.account_id = $1";
      const result = await pool.query(sql, [account_id])
      return result.rows
    } catch (error) {
      return error.message
    }
  }

  module.exports = { addReview, getReviewByInvId, getReviewByAccount_id }