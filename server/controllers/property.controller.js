const Property = require("../models/Property");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// CREATE PROPERTY
exports.createProperty = async (req, res) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json({ message: "Property created successfully", property });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL PROPERTIES
exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll();
        // res.json(properties);

        const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
        const notice = []

        res.render('tenant-prop', { userData, notice, properties })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET PROPERTY BY ID
exports.getPropertyById = async (req, res) => {
    try {
        const properties = await Property.findByPk(req.params.id);
        if (!properties) return res.status(404).json({ error: "Property not found" });

        // res.json(property);
        const property = properties.dataValues
        const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
        const notice = []
        res.render('tenant-prop1', { userData, notice, property })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE PROPERTY
exports.updateProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ error: "Property not found" });

        await property.update(req.body);
        res.json({ message: "Property updated successfully", property });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ error: "Property not found" });

        await property.destroy();
        // res.json({ message: "Property deleted successfully" });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
