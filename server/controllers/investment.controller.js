const Investment = require("../models/investment");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const dotenv = require("dotenv");
dotenv.config();




// Configure multer for file storage in 'public/prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/invest/'); // Ensure 'public/prop' directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filenames
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 5 // Limiting the number of files to 5
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).array('picture', 5); // Matches the name attribute in the form


/**
 * CREATE INVESTMENT
 */
exports.createInvestment = async (req, res) => {

    upload(req, res, async function (err) {
        if (err) {

            return res.status(400).json({ error: err.message });
        }

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => file.path); // Save paths to database
        }
        try {

            const { investor_id, investment_name, details, investment_amount, expected_return, investment_duration } = req.body;
            // Add image paths to req.body
           
            const pictures = req.files.map(file => file.filename);
            
            const picture = "" + pictures + "";
            const newInvestment = await Investment.create({
                investor_id,
                investment_name,
                details,
                investment_amount,
                expected_return,
                investment_duration,
                picture,
            });

            res.redirect('/spco/investment')

            // res.status(201).json({ message: "Investment created successfully", investment: newInvestment });
        } catch (error) {
            console.log('Error : ', error)
            res.status(500).json({ error: error.message });
        }
    });






};

/**
 * GET ALL INVESTMENTS
 */
exports.getAllInvestments = async (req, res) => {
    try {
        const investments = await Investment.findAll();
        // res.json(investments);

        const userData = jwt.verify(req.cookies.investor, process.env.JWT_SECRET);
        const notice = []

        res.render('invest-investment', { userData, notice, investments })
    } catch (error) {
        console.log("the eror is ", error)
        res.status(500).json({ error: error.message });
    }
};


exports.getAllActive = async (req, res) => {
    try {
        const investments = await Investment.findAll({ where: { status: 'active' } });
        // res.json(investments);

        const userData = jwt.verify(req.cookies.investor, process.env.JWT_SECRET);

        const notice = []

        res.render('invest-investment', { userData, notice, investments })
    } catch (error) {
        console.log("the eror is ", error)
        res.status(500).json({ error: error.message });
    }
};


exports.getAllAdminInvest = async (req, res) => {
    try {
        const investments = await Investment.findAll();
        // res.json(investments);

        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);

        const notice = []
        console.log('The invesment ', investments)

        res.render('admin-investment', { userData, notice, investments })
    } catch (error) {
        console.log("the eror is ", error)
        res.status(500).json({ error: error.message });
    }
};

/**
 * GET SINGLE INVESTMENT
 */
exports.getInvestmentByIdAd = async (req, res) => {
    try {
        const investments = await Investment.findByPk(req.params.id);
        if (!investments) return res.status(404).json({ error: "Investment not found" });

        // res.json(investment);
        const investment = investments.dataValues
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        const notice = []
        res.render('admin-investment1', { userData, notice, investment })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/** * GET SINGLE INVESTMENT */
exports.getInvestmentById = async (req, res) => {
    try {
        const investments = await Investment.findByPk(req.params.id);
        if (!investments) return res.status(404).json({ error: "Investment not found" });

        // res.json(investment);
        const investment = investments.dataValues
        const userData = jwt.verify(req.cookies.investor, process.env.JWT_SECRET);
        const notice = []


        res.render('invest-investment1', { userData, notice, investment })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * UPDATE INVESTMENT
 */
exports.updateInvestment = async (req, res) => {
    try {
        const { property_name, details, investment_amount, expected_return, investment_duration, status } = req.body;

        const investment = await Investment.findByPk(req.params.id);
        if (!investment) return res.status(404).json({ error: "Investment not found" });

        await investment.update({ property_name, details, investment_amount, expected_return, investment_duration, status });

        res.json({ message: "Investment updated successfully", investment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE INVESTMENT
 */
exports.deleteInvestment = async (req, res) => {
    try {
        const investment = await Investment.findByPk(req.params.id);
        if (!investment) return res.status(404).json({ error: "Investment not found" });

        await investment.destroy();
        // res.json({ message: "Investment deleted successfully" });

        return res.redirect("/spco/investment");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
