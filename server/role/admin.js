const express = require("express");
const propertyController = require("../controllers/property.controller");
const router = express.Router();
const rentController = require("../controllers/rent.controller");
const adminController = require("../controllers/admin.controller");
const helpDeskController = require("../controllers/helpdesk.controller");
const investorController = require("../controllers/investor.controller");
const tenantController = require("../controllers/tenant.controller");
const authAdmin = require("../middleware/authAdmin");
const {
    createInvestment,
    getAllInvestments,
    getInvestmentById,
    updateInvestment,
    deleteInvestment,
    getAllAdmin,
    getAllAdminInvest,
    getInvestmentByIdAd
} = require("../controllers/investment.controller");



// Dashboard Section 
router.get('/', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-dash', {userData , notice})
})



// Investment section 

router.get("/investment/", getAllAdminInvest);
router.get("/investment/:id", getInvestmentByIdAd);

// To get create ivestment page 
// Dashboard Section 
router.get('/create-investment', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-invest_form', {userData , notice})
})
router.post("/investment/", createInvestment);

// Undone 
router.put("/investment/:id", updateInvestment);
router.delete("/investment/:id", deleteInvestment);

// Properties Routes

router.post("/props/", propertyController.createProperty);
router.get("/props/", propertyController.getAllPropertiesAdmin);
router.get("/props/:id", propertyController.getPropertyByIdAdmin);

router.put("//props:id", propertyController.updateProperty);
router.delete("props/:id", propertyController.deleteProperty);



// Help Desk Section

// Get All Help Request
router.get("/help-desk/", helpDeskController.getAllHelpDeskAd);
// Get Only One Help 
router.get("/help-desk/:id", helpDeskController.getHelpDeskByIdAdmin);
// Edit Help 
router.put("/help/:id", helpDeskController.updateHelpDesk);


// Rent Section 
router.post("/create/rent", rentController.createRent);
router.get("/rent/", rentController.getAllRent);
router.get("/rent/:id", rentController.getRentByIdAdmin);
router.put("/rent/:id", rentController.updateRent);
router.delete("/rent/:id", rentController.deleteRent);


 







// User Section 

// Dashboard Section 
router.get('/users', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-users', {userData , notice})
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















module.exports = router;
