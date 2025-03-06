const express = require("express");
const router = express.Router();
const rentController = require("../controllers/rent.controller");
const propertyController = require("../controllers/property.controller");
const adminController = require("../controllers/admin.controller");
const helpDeskController = require("../controllers/helpdesk.controller");
const investorController = require("../controllers/investor.controller");
const tenantController = require("../controllers/tenant.controller");






// Dashboard Section 
router.get('/', (req, res)=>{
    res.render('/dashboard')
})


// Admin Section

// Register new Admin 
router.post("/admin/", adminController.createAdmin);
// See all admin 
router.get("/admin/", adminController.getAllAdmins);
// Get one admin 
router.get("/admin/:id", adminController.getAdminById);
router.put("/admin/:id", adminController.updateAdmin);
router.delete("/admin/:id", adminController.deleteAdmin);

// Investor Routes

router.post("/investor/", investorController.createInvestor);
router.get("/investors", investorController.getAllInvestors);
router.get("/investor/:id", investorController.getInvestorById);
router.put("/investor/:id", investorController.updateInvestor);
router.delete("/investor/:id", investorController.deleteInvestor);

// Tenant Section 

router.post("/tenantz/", tenantController.createTenant);
router.get("/tenantz/", tenantController.getAllTenants);
router.get("/tenantz/:id", tenantController.getTenantById);
router.put("/tenantz/:id", tenantController.updateTenant);
router.delete("/tenantz/:id", tenantController.deleteTenant);


// Properties 

router.post("/create/prop", propertyController.createProperty);
router.get("/propz/", propertyController.getAllProperties);
router.get("/prop/:id", propertyController.getPropertyById);
router.put("/prop/:id", propertyController.updateProperty);
router.delete("/prop/:id", propertyController.deleteProperty);


// Investments 



// Help Desk Section

// Get All Help Request
router.get("/help/", helpDeskController.getAllHelpDesk);
// Get Only One Help 
router.get("/help/:id", helpDeskController.getHelpDeskById);
// Edit Help 
router.put("/help/:id", helpDeskController.updateHelpDesk);


// Rent Section 
router.post("/create/rent", rentController.createRent);
router.get("/rent/", rentController.getAllRent);
router.get("/rent/:id", rentController.getRentById);
router.put("/rent/:id", rentController.updateRent);
router.delete("/rent/:id", rentController.deleteRent);









module.exports = router;
