const express = require("express");
const router = express.Router();
const rentController = require("../controllers/rentController");

// CRUD Routes
router.post("/", rentController.createRent);
router.get("/", rentController.getAllRent);
router.get("/:id", rentController.getRentById);
router.put("/:id", rentController.updateRent);
router.delete("/:id", rentController.deleteRent);

module.exports = router;
