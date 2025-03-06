const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const investorController = require("../controllers/investor.controller");
const savedProperty = require("../controllers/savedProperty.controller");
const tenantController = require("../controllers/tenant.controller");
const propertyController = require("../controllers/property.controller");
const authenticateTenant = require("../middleware/authTenant");




router.get('/', authenticateTenant ,(req, res)=>{
    const notice = [];
    const userData = req.tenant;

    console.log("The user Data is ",userData)
    res.render('tenant-dash', {userData , notice})
})



// Protected route example: Get Investor Profile
router.get("/profile", authenticateTenant, (req, res) => {

    const userData = req.tenant;
    const notice = []
    res.render('tenant-profile', {userData , notice})
    // res.json({ investor: req.investor });
});


// Get Investor Edit Page 
router.get("/profile-edit", authenticateTenant, (req, res) => {
    const userData = req.tenant;
    const notice = []
    
    res.render('tenant-profile1', {userData , notice})
    // res.json({ investor: req.investor });
});


// Edit Tenant Profile 

router.put("/tenantz/:id", tenantController.updateTenant);



// TO See All Properties


router.get("/properties/", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);



// SAVE A PROPERTY API 


router.post("/save-prop/", savedProperty.createSavedProperty);
router.get("/save-prop/", savedProperty.getAllMySaved);
router.get("/saver/:id", savedProperty.addProperty);
router.get("/saved-delete/:id", savedProperty.deleteSavedProperty);













module.exports = router;
