const Tenant = require("../models/Tenant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");

// CREATE A TENANT
exports.createTenant = async (req, res) => {
    try {
        const tenant = await Tenant.create(req.body);
        res.status(201).json({ message: "Tenant created successfully", tenant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Login Tenant 
exports.loginTenant = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if tenant exists
        const admore = await Tenant.findOne({ where: { email } });
        
        if (!admore) {
            let error = "Tenant account not found";
            return res.render('error-home', { error, layout: false })
            // return res.status(404).json({ error: "Tenant account not found" });
        }
        const tenant = admore.dataValues
        // Check password
        // const validPassword = await bcrypt.compare(password, tenant.password_hash);
        // if (!validPassword) {
            // return res.status(400).json({ error: "Invalid credentials" });
        //     let error = "Check Password & Email Again";
        //     return res.render('error-home', { error, layout: false })
        // }
        delete tenant.password_hash
        tenant.acct_type = "tenant";
        
        // Generate JWT Token
        const token = jwt.sign(tenant, process.env.JWT_SECRET, {
            expiresIn: "4d",
        });

        // Set HTTP-only cookie
        res.cookie("tenant", token, { httpOnly: true });
        // res.json({ message: "Login successful", token, tenant });
        res.redirect('/tnt')

    } catch (error) {
        console.log("The error is ", error)
        res.status(500).json({ error: error.message });
    }
};

// GET ALL TENANTS
exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.findAll();
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE TENANT
exports.getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ error: "Tenant not found" });

        res.json(tenant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE A TENANT
exports.updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ error: "Tenant not found" });

        await tenant.update(req.body);
        res.json({ message: "Tenant updated successfully", tenant });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE A TENANT
exports.deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ error: "Tenant not found" });

        await tenant.destroy();
        res.json({ message: "Tenant deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
