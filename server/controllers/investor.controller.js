const Investor = require("../models/Investor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");

// CREATE AN INVESTOR
exports.createInvestor = async (req, res) => {
    try {
        const { full_name, email, phone, password, about, investment_amount } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newInvestor = await Investor.create({
            investor_id: uuidv4(),
            full_name,
            email,
            phone,
            password_hash: hashedPassword,
            about,
            investment_amount,
        });

        res.status(201).json({ message: "Investor created successfully", investor: newInvestor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login Investor 
exports.loginInvestor = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if investor exists
        const admore = await Investor.findOne({ where: { email } });

        if (!admore) {
            // return res.status(404).json({ error: "investor not found" });

            let error = "Investor Credential not registered";
            return res.render('error-home', { error, layout: false })
        }
        const investor = admore.dataValues;
        // Check password
        const validPassword = await bcrypt.compare(password, investor.password_hash);
        // if (!validPassword) {
        //     // return res.status(400).json({ error: "Invalid credentials" });
        //     let error = "Check Login Details";
        //     return res.render('error-home', { error, layout: false })
        // }


        delete investor.password_hash;
        investor.acct_type = "investor";

        // Generate JWT Token
        const token = jwt.sign(investor, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });
        // Set HTTP-only cookie
        res.cookie("investor", token, { httpOnly: true });
        // res.json({ message: "Login successful", token, investor });
        res.redirect('/invst')

    } catch (error) {
        console.log("The error is ", error)
        res.status(500).json({ error: error.message });
    }
};

// GET ALL INVESTORS
exports.getAllInvestors = async (req, res) => {
    try {
        const investors = await Investor.findAll();
        // res.json(investors);
        const notice = [];
        const users = investors;
        const acct_type = 'Investors';
        return res.render('admin-users-type', { users, userData, notice, acct_type })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE INVESTOR
exports.getInvestorById = async (req, res) => {
    try {
        const investor = await Investor.findByPk(req.params.id);
        if (!investor) return res.status(404).json({ error: "Investor not found" });

        // res.json(investor);
        const notice = [];
        const user = investor.dataValues;
        delete user.password_hash
        return res.render('admin-users-investor', { user, userData, notice, acct_type })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE INVESTOR DETAILS
exports.updateInvestor = async (req, res) => {
    try {
        const { full_name, email, phone, about, investment_amount } = req.body;
        const investor = await Investor.findByPk(req.params.id);

        if (!investor) return res.status(404).json({ error: "Investor not found" });

        await investor.update({ full_name, email, phone, about, investment_amount });

        res.json({ message: "Investor updated successfully", investor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE AN INVESTOR
exports.deleteInvestor = async (req, res) => {
    try {
        const investor = await Investor.findByPk(req.params.id);
        if (!investor) return res.status(404).json({ error: "Investor not found" });

        await investor.destroy();
        res.json({ message: "Investor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
