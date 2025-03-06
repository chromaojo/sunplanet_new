const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

// CRUD Routes
router.post("/", tenantController.createTenant);
router.get("/", tenantController.getAllTenants);
router.get("/:id", tenantController.getTenantById);
router.put("/:id", tenantController.updateTenant);
router.delete("/:id", tenantController.deleteTenant);

module.exports = router;
