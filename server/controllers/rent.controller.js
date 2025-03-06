const Rent = require("../models/Rent");

// CREATE RENT RECORD
exports.createRent = async (req, res) => {
    try {
        const rent = await Rent.create(req.body);
        res.status(201).json({ message: "Rent record created successfully", rent });
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
