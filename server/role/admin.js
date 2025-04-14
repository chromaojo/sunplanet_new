const express = require("express");
const propertyController = require("../controllers/property.controller");
const router = express.Router();
const propertyTypeController = require("../controllers/propertyType.controller");
const  propertyType = require("../models/Property_type");
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

// Admin Profile 

router.get("/profile", authAdmin, (req, res) => {
    const userData = req.admin;
    const notice = [];

    res.render('admin-profile1', {userData , notice})
    // res.json({ investor: req.investor });
});




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
router.get("/del/investnt/:id", deleteInvestment);



// Property Type section 


// CRUD Routes
router.post("/property/type", propertyTypeController.createPropertyType);
router.get("/property-type", propertyTypeController.getAllPropertyTypes);
router.get("/del/property-type/:id", propertyTypeController.deletePropertyType);

// Properties Routes
router.get('/create-property', authAdmin ,async(req, res)=>{

    const notice = [];
    const userData = req.admin;
    const propertyTypes = await propertyType.findAll();
    console.log('The types are ', propertyTypes)

    res.render('admin-prop-form', {userData , notice, propertyTypes})
})

router.post("/props/create", propertyController.createProperty);
router.get("/props/", propertyController.getAllPropertiesAdmin);
router.get("/props/:id", propertyController.getPropertyByIdAdmin);

router.put("/props:id", propertyController.updateProperty);
router.get("/props/del/:id", propertyController.deleteProperty);



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
router.post("/renting/:id", rentController.updateRent);
router.delete("/del/rent/:id", rentController.deleteRent);



// User Section 

// Dashboard Section 
router.get('/users', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-users', {userData , notice})
})

// Admin Section 

router.get('/create-staff', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-create-staff', {userData , notice})
})
// Register new Admin 
router.post("/admin/create", adminController.createAdmin);
// See all admin 
router.get("/admins/", adminController.getAllAdmins);
// Get one admin 
router.get("/admin/:id", adminController.getAdminById);
router.put("/admin/:id", adminController.updateAdmin);
router.delete("/admin/:id", adminController.deleteAdmin);




// Investor Routes

router.get('/create-investor', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-create-investor', {userData , notice})
})

router.post("/investor/create-YxXLpP64K", investorController.createInvestor);
router.get("/investors", investorController.getAllInvestors);
router.get("/investor/:id", investorController.getInvestorById);
router.put("/investor/:id", investorController.updateInvestor);
router.delete("/investor/:id", investorController.deleteInvestor);

// Tenant Section 

router.get('/create-tenant', authAdmin ,(req, res)=>{

    const notice = [];
    const userData = req.admin;

    res.render('admin-create-tenant', {userData , notice})
})

router.post("/tenantz/create", tenantController.createTenant);
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
