const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

router.get("/type/:classification_id", invController.buildByClassificationId)
router.get("/detail/:inventory_id", invController.buildByInventoryId)

module.exports = router