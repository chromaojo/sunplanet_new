const express = require("express");
const router = express.Router();
const helpDeskController = require("../controllers/helpDeskController");

// CRUD Routes
router.post("/", helpDeskController.createHelpDesk);
router.get("/", helpDeskController.getAllHelpDesk);
router.get("/:id", helpDeskController.getHelpDeskById);
router.put("/:id", helpDeskController.updateHelpDesk);
router.delete("/:id", helpDeskController.deleteHelpDesk);

module.exports = router;
