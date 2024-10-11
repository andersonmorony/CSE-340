const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")
const validate = require("../utilities/inventory-validation")


router.get("/type/:classification_id", invController.buildByClassificationId)
router.get("/detail/:inventory_id", invController.buildByInventoryId)

//management
router.get("/management", utilities.handleErrors(invController.buildManagementView))
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification",
    regValidate.ClassificationRules(),
    validate.checkClassificationRules,
    utilities.handleErrors(invController.CreateClassification))

module.exports = router