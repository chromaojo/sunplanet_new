const express = require("express");
const router = express.Router();
const propertyTypeController = require("../controllers/propertyTypeController");

// CRUD Routes
router.post("/", propertyTypeController.createPropertyType);
router.get("/", propertyTypeController.getAllPropertyTypes);
router.get("/:id", propertyTypeController.getPropertyTypeById);
router.put("/:id", propertyTypeController.updatePropertyType);
router.delete("/:id", propertyTypeController.deletePropertyType);

module.exports = router;
