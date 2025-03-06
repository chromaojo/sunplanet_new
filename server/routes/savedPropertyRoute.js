const express = require("express");
const router = express.Router();
const savedProperty = require("../controllers/savedProperty.controller");

// CRUD Routes
router.post("/", savedProperty.createSavedProperty);
router.get("/", savedProperty.getAllSavedProperties);
router.get("/:id", savedProperty.getSavedPropertyById);
router.put("/:id", savedProperty.updateSavedProperty);
router.delete("/:id", savedProperty.deleteSavedProperty);

module.exports = router;
