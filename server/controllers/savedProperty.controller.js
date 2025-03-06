const SavedProperty = require("../models/savedProperty");
const Property = require("../models/Property");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// CREATE A SAVED PROPERTY
exports.createSavedProperty = async (req, res) => {
    try {
        const savedProperty = await SavedProperty.create(req.body);
        res.status(201).json({ message: "Property saved successfully", savedProperty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL SAVED PROPERTIES
exports.getAllSavedProperties = async (req, res) => {
    try {
        const savedProperties = await SavedProperty.findAll();
        // res.json(savedProperties);

        const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
        const notice = []

        res.render('tenant-saved', { userData, notice, savedProperties })
    } catch (error) {
        console.log("The error is ", error)
        res.status(500).json({ error: error.message });
    }
};


exports.getAllMySaved = async (req, res) => {
    const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
    try {
        const tenant_id = userData.tenant_id;
        const savedProperties = await SavedProperty.findAll({ where: { user_id: tenant_id } });
        // res.json(savedProperties);

        const notice = []

        res.render('tenant-saved', { userData, notice, savedProperties })

    } catch (error) {
        console.log("The error is ", error)
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE SAVED PROPERTY
exports.getSavedPropertyById = async (req, res) => {
    try {
        const savedProperty = await SavedProperty.findByPk(req.params.id);
        if (!savedProperty) return res.status(404).json({ error: "Saved property not found" });

        res.json(savedProperty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addProperty = async (req, res) => {
    const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
    try {
        // Get the property details 
        const property0 = await Property.findByPk(req.params.id);
        if (!property0) {
            // return res.status(404).json({ error: "Property not found" });
            let error = "Property not found";
            return res.render('error', { userData, error })
        }

        const property = property0.dataValues;

        // Check if the property is already archived by the same user
        const existingProperty = await SavedProperty.findOne({
            where: {
                user_id: userData.tenant_id,
                prop_link: `/properties/${property.id}`
            }
        });

        if (existingProperty) {
            // return res.status(400).json({ message: "Property Already Added" });
            let error = "Property Already Added";
            return res.render('error', { userData, error })
        }

        // Generate a random archive_id 
        let random = Math.floor(Math.random() * 99999999 / 13.9);

        // Save to Archive 
        const archiveIt = {
            name: property.property_name,
            save_type: "property",
            user_id: userData.tenant_id,
            prop_link: `/properties/${property.id}`,
            price: property.rent_price,
            picture: property.picture,
            archive_id: random
        };

        const savedProperty = await SavedProperty.create(archiveIt);

        // Redirect after successful save
        res.redirect('/tnt/properties');
    } catch (error) {
        console.error('The Error is ', error);
        // res.status(500).json({ error: error.message });
        return res.render('error', { userData, error })
    }
};


// UPDATE A SAVED PROPERTY
exports.updateSavedProperty = async (req, res) => {
    try {
        const savedProperty = await SavedProperty.findByPk(req.params.id);
        if (!savedProperty) return res.status(404).json({ error: "Saved property not found" });

        await savedProperty.update(req.body);
        res.json({ message: "Saved property updated successfully", savedProperty });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE A SAVED PROPERTY
exports.deleteSavedProperty = async (req, res) => {
    try {
        const savedProperty = await SavedProperty.findByPk(req.params.id);
        if (!savedProperty) return res.status(404).json({ error: "Saved property not found" });

        await savedProperty.destroy();
        // res.json({ message: "Saved property deleted successfully" });
        
        res.redirect('/tnt/save-prop');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
