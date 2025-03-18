const express = require("express");
const router = express.Router();
const investorController = require("../controllers/investor.controller");
const investPortfolioController = require("../controllers/investPortfolio.controller");
const helpDeskController = require("../controllers/helpdesk.controller");
const authenticateInvestor = require("../middleware/authInvestor");
const {
    createInvestment,
    getAllActive,
    getInvestmentById
} = require("../controllers/investment.controller");
// Investor Routes


// Investor Dashboard Route 
router.get('', authenticateInvestor,(req, res)=>{
    const notice = [];
    const userData = req.investor;

    console.log("The user Data is ",userData)
    res.render('invest-dash', {userData , notice})
})


// Protected route example: Get Investor Profile

router.get("/profile-edit", authenticateInvestor, (req, res) => {
    const userData = req.investor;
    const notice = []
    console.log("The user Data is ",userData)
    res.render('invest-profile1', {userData , notice})
    // res.json({ investor: req.investor });
});


// Investment Portfolio
router.post("/inve", investPortfolioController.createInvestment);
router.get("/inve", investPortfolioController.getAllInvestments);
router.get("/inves/:id", investPortfolioController.getOneInvestment);
router.get("/my-investments", investPortfolioController.getInvestmentsByInvestor);
// See & Edit Persoal Profile 
router.put("/inv/:id", investorController.updateInvestor);


// Help Desk Section 


// CRUD Routes
router.post("/help", helpDeskController.createHelpDesk);
router.get("/help", helpDeskController.getAllMyHelp);
router.get("/help/:id", helpDeskController.getHelpDeskById);



// View available investment opportunities.
router.post("/investment", createInvestment);
router.get("/investment", getAllActive);
router.get("/investment/:id", getInvestmentById);

// Invest in properties for rental income or future resale.
// Track investment returns and rental income.
// Request withdrawals of investment profits.
// Receive updates on property status.

// Access only investment-related sections.
// View personal investment records and returns.
// Request fund withdrawals.
// Communicate with platform support/admin.



module.exports = router;
