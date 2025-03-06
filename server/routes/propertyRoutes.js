const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

// CRUD Routes
router.post("/", propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
