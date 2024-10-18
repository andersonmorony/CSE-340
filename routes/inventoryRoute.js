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

// add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInventoryRules,
     utilities.handleErrors(invController.CreateInventory))

// Return inv by classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView));
router.post("/edit/", regValidate.UpdateInventoryRules(),
 regValidate.checkUpdateInventoryRules,
  utilities.handleErrors(invController.updateInventory));


// Delete router
router.get("/Delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))

router.post("/Delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router