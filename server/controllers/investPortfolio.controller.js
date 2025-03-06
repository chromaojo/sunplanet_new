const InvestPortfolio = require("../models/InvestPortfolio");
const jwt = require("jsonwebtoken");

// CREATE INVESTMENT PORTFOLIO
exports.createInvestment = async (req, res) => {
    try {
        const { investor_id, investment_amount, investment_plan, investment_duration, start_date, end_date, expected_return, status } = req.body;

        const newInvestment = await InvestPortfolio.create({
            investor_id,
            investment_amount,
            investment_plan,
            investment_duration,
            start_date,
            end_date,
            expected_return,
            status
        });

        res.status(201).json({ message: "Investment created successfully", investment: newInvestment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL INVESTMENTS
exports.getAllInvestments = async (req, res) => {
    try {
        const investments = await InvestPortfolio.findAll();
        // res.json(investments);
        const investorCookie = req.cookies.investor;
        const userData = jwt.verify(investorCookie, process.env.JWT_SECRET);

        const notice = []
        res.render('invest-all', { userData, notice, investments })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET SINGLE INVESTMENT BY ID


// GET INVESTMENTS BY INVESTOR ID
exports.getInvestmentsByInvestor = async (req, res) => {
    try {
        // Decode investor data from cookies
        const investorCookie = req.cookies.investor;
        if (!investorCookie) return res.status(401).json({ error: "Unauthorized: No login details" });

        // Verify JWT (assuming the investor ID is stored in a token)
        const userData = jwt.verify(investorCookie, process.env.JWT_SECRET);
        const investorId = userData.investor_id; // Ensure this matches the stored field name

        // Fetch all investments for the investor
        const investments = await InvestPortfolio.findAll({ where: { investor_id: investorId } });
        // if (investments.length === 0) return res.status(404).json({ error: "No investments found for this investor" });

        // res.json({ investments }); const userData = decoded


        const notice = []

        res.render('invest-all', { userData, notice, investments })


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// UPDATE INVESTMENT
exports.updateInvestment = async (req, res) => {
    try {
        const { investment_amount, investment_plan, investment_duration, end_Date, expected_return, status } = req.body;
        const investment = await InvestPortfolio.findByPk(req.params.id);

        if (!investment) return res.status(404).json({ error: "Investment not found" });

        await investment.update({ investment_amount, investment_plan, investment_duration, end_Date, expected_return, status });

        res.json({ message: "Investment updated successfully", investment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE INVESTMENT
exports.deleteInvestment = async (req, res) => {
    try {
        const investment = await InvestPortfolio.findByPk(req.params.id);
        if (!investment) return res.status(404).json({ error: "Investment not found" });

        await investment.destroy();
        res.json({ message: "Investment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOneInvestment = async (req, res) => {
    try {
        const investments = await InvestPortfolio.findByPk(req.params.id);
        if (!investments) return res.status(404).json({ error: "Investment not found" });
        // res.json({ message: investment });
        const investment = investments.dataValues ;
        const investorCookie = req.cookies.investor;
        const userData = jwt.verify(investorCookie, process.env.JWT_SECRET);
        const notice = []
        console.log("The investment is ", investment)
        res.render('invest-one', { userData, notice, investment })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
