const express = require("express");
const router = express.Router();
const investPortfolioController = require("../controllers/investPortfolioController");

// CRUD Routes
router.post("/", investPortfolioController.createInvestment);
router.get("/", investPortfolioController.getAllInvestments);
router.get("/:id", investPortfolioController.getInvestmentById);
router.put("/:id", investPortfolioController.updateInvestment);
router.delete("/:id", investPortfolioController.deleteInvestment);

module.exports = router;
