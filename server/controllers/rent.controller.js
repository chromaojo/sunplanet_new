const Rent = require("../models/Rent");
const Property = require("../models/Property");
const jwt = require("jsonwebtoken");

// CREATE RENT RECORD
exports.createRent = async (req, res) => {
    try {
        const rent = await Rent.create(req.body);
        console.log("The rentage is created ", rent)
        // res.status(201).json({ message: "Rent record created successfully", rent });
        res.redirect("/tnt/wisper")
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// To Get Rental Form 

exports.getRentalForm = async (req, res) => {
    try {
        const properties = await Property.findByPk(req.params.id);
        if (!properties) return res.status(404).json({ error: "Property not found" });

        // res.json(property);
        const property = properties.dataValues
        const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
        const notice = []
        console.log("This property is ", property)
        res.render('tenant-rent', { userData, notice, property })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL RENT RECORDS
exports.getAllRent = async (req, res) => {
    try {
        const rents = await Rent.findAll();
        res.json(rents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET ALL RENT RECORDS
exports.getAllMyRent = async (req, res) => {
    const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
    try {
        const myId = userData.tenant_id;

        const rents = await Rent.findAll({
            where: {
                user_id : myId
            }
        });
        res.json(rents);
        const notice = []
        console.log("This property is ", rents)
        res.render('tenant-rent', { userData, notice, rents })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// GET SINGLE RENT RECORD
exports.getRentById = async (req, res) => {
    try {
        const rent = await Rent.findByPk(req.params.id);
        if (!rent) return res.status(404).json({ error: "Rent record not found" });

        res.json(rent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE RENT RECORD
exports.updateRent = async (req, res) => {
    try {
        const rent = await Rent.findByPk(req.params.id);
        if (!rent) return res.status(404).json({ error: "Rent record not found" });

        await rent.update(req.body);
        res.json({ message: "Rent record updated successfully", rent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE RENT RECORD
exports.deleteRent = async (req, res) => {
    try {
        const rent = await Rent.findByPk(req.params.id);
        if (!rent) return res.status(404).json({ error: "Rent record not found" });

        await rent.destroy();
        res.json({ message: "Rent record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
