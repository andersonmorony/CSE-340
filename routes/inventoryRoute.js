const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/type/:classification_id", invController.buildByClassificationId)

module.exports = router