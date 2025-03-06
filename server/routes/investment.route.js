const express = require("express");
const {
    createInvestment,
    getAllInvestments,
    getInvestmentById,
    updateInvestment,
    deleteInvestment
} = require("../controllers/investment.controller");

const router = express.Router();

router.post("/", createInvestment);
router.get("/", getAllInvestments);
router.get("/:id", getInvestmentById);
router.put("/:id", updateInvestment);
router.delete("/:id", deleteInvestment);

module.exports = router;
