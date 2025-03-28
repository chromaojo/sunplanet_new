const PropertyType = require("../models/Property_type");

// CREATE A PROPERTY TYPE
exports.createPropertyType = async (req, res) => {
    try {
        const { prop_type } = req.body;

        // Check if property type already exists
        const existingType = await PropertyType.findOne({ where: { prop_type } });
        if (existingType) return res.status(400).json({ error: "Property type already exists" });

        const propertyType = await PropertyType.create({ prop_type });

        // res.status(201).json({ message: "Property type created successfully", propertyType });
        res.redirect('/spco/create-property')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL PROPERTY TYPES
exports.getAllPropertyTypes = async (req, res) => {
    try {
        const propertyTypes = await PropertyType.findAll();
        res.json(propertyTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE PROPERTY TYPE
exports.getPropertyTypeById = async (req, res) => {
    try {
        const propertyType = await PropertyType.findByPk(req.params.id);
        if (!propertyType) return res.status(404).json({ error: "Property type not found" });

        res.json(propertyType);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE A PROPERTY TYPE
exports.updatePropertyType = async (req, res) => {
    try {
        const { prop_type } = req.body;
        const propertyType = await PropertyType.findByPk(req.params.id);

        if (!propertyType) return res.status(404).json({ error: "Property type not found" });

        await propertyType.update({ prop_type });

        res.json({ message: "Property type updated successfully", propertyType });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE A PROPERTY TYPE
exports.deletePropertyType = async (req, res) => {
    try {
        const propertyType = await PropertyType.findByPk(req.params.id);
        if (!propertyType) return res.status(404).json({ error: "Property type not found" });

        await propertyType.destroy();
        // res.json({ message: "Property type deleted successfully" });
        res.redirect('/spco/create-property')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
