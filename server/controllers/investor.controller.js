const Investor = require("../models/Investor");
const bcrypt = require("bcryptjs");
const mail = require('../config/mail')
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");

// CREATE AN INVESTOR
exports.createInvestor = async (req, res) => {
    try {
        const { full_name, email, phone, about, investment_amount, bank_acct, whatsapp, bank_name, bank_acct_name } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(phone, 10);

        const newInvestor = await Investor.create({
            investor_id: uuidv4(),
            full_name, email, phone,
            password_hash: hashedPassword,
            bank_acct, whatsapp, bank_name, bank_acct_name
        });
        const messages = {
            from: {
                name: 'Sun Planet Company',
                address: 'felixtemidayoojo@gmail.com',
            },
            to: email,
            subject: "Welcome to Sun Planet Company – Your Real Estate Investment Partner!!",
            text: `
            Dear ${full_name},
            
            Welcome to Sun Planet Company Ltd., where we turn property investments into lasting value and success!

            Your account has been created, and your phone number ${phone} is set as your temporary password. To secure your account, we recommend changing your password immediately.

            Here’s how:

            Visit [website link] and log in with your phone number and temporary password.

            Navigate to "Settings" > "Change Password."

            Create a strong and unique password to safeguard your account.

            As a valued investor, you now have access to exclusive opportunities, detailed reports, and tools to monitor your investment progress. For any questions, our team is here to assist you.

            Thank you for trusting Sun Planet Company with your investment journey!

            Best regards,
            The Sun Planet Team
                        
            http://sunplanet.ng/ | https://wa.me/8101631008 | +234 706 623 1523`
        };

        // Send email
        mail.sendIt(messages);
        res.redirect('/spco/investors')
    } catch (error) {
        console.error('The error is ', error)
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
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
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
        const acct_type = 'Investor'
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        delete user.password_hash;
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
