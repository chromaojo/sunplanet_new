const Property = require("../models/Property");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const dotenv = require("dotenv");
let random = Math.floor(Math.random() * 9999999);
dotenv.config();

// Configure multer for file storage in 'public/prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/prop/'); // Ensure 'public/prop' directory exists
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

// Controller
exports.createProperty = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            
            return res.status(400).json({ error: err.message });
        }

        try {
            // Collect file paths of uploaded images
            let imagePaths = [];
            if (req.files && req.files.length > 0) {
                imagePaths = req.files.map(file => file.path); // Save paths to database
            }

            // Add image paths to req.body
            req.body.images = imagePaths; // Assuming the 'images' field is a JSON string in the model
            const pix = ""+imagePaths+""
            req.body.picture = pix;
            req.body.prop_id = random;
            
            const property = await Property.create(req.body);
            
            // res.status(201).json({ message: "Property created successfully", property });
            res.redirect('/spco/props')
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ error: error.message });
        }
    }); 
};


// GET ALL PROPERTIES
exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']]
        });
        // res.json(properties);

        const userData = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
        const notice = []

        res.render('tenant-prop', { userData, notice, properties })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAllSalesFrontProp = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']],
            where : {action : 'for_sale'}
        });
        res.render('home-search', { properties, layout: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllLeaseFrontProp = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']],
            where :{ action : 'for_lease'}
        });
        res.render('home-search', { properties, layout: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllShortFrontProp = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']],
            where : {action : 'shortlet'}
        });
        res.render('home-prop', { properties, layout: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL PROPERTIES
exports.getAllFrontProp = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']]
        });
        res.render('home-prop', { properties, layout: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOneFrontById = async (req, res) => {
    try {
        const properties = await Property.findByPk(req.params.id);
        if (!properties) return res.status(404).json({ error: "Property not found" });

        // res.json(property);
        const property = properties.dataValues
        const myAddress = property.address+ ", "+ property.city+ ", "+property.state +", "+property.country ;

        const encodedAddress = encodeURIComponent(myAddress);
        const iframeSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

        const notice = []
        res.render('home-prop1', { layout : false , property , iframeSrc })
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
        const myAddress = property.address+ ", "+ property.city+ ", "+property.state +", "+property.country ;

        const encodedAddress = encodeURIComponent(myAddress);
        const iframeSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

        const notice = []
        res.render('tenant-prop1', { userData, notice, property , iframeSrc })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL PROPERTIES
exports.getAllPropertiesAdmin = async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']]
        });
        // res.json(properties);

        
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        const notice = []
        res.render('admin-prop', { userData, notice, properties })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET PROPERTY BY ID
exports.getPropertyByIdAdmin = async (req, res) => {
    try {
        const properties = await Property.findByPk(req.params.id);
        if (!properties) return res.status(404).json({ error: "Property not found" });

        // res.json(property);
        const property = properties.dataValues
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        const myAddress = property.address+ ", "+ property.city+ ", "+property.state +", "+property.country ;

        const encodedAddress = encodeURIComponent(myAddress);
        const iframeSrc = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

        const notice = []
        res.render('admin-prop1', { userData, notice, property, iframeSrc })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};








// Handle Search Query
exports.searchProperty = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.redirect('/properties');
        }

        // Search properties by name or description (case-insensitive)
        const properties = await Property.findAll({
            where: {
                [Op.or]: [
                    { property_name: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        if (!properties.length) {
            return res.render('error-home', { error: 'No property found.', layout: false });
        }


        res.render('home-search', { properties, layout: false });
    } catch (err) {
        res.render('error-home', { error: err.message, layout: false });
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
