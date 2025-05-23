const Tenant = require("../models/Tenant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');
const dotenv = require("dotenv");
const mail = require('../config/mail')
dotenv.config();
const { v4: uuidv4 } = require("uuid");

// CREATE A TENANT
exports.createTenant = async (req, res) => {
    const { full_name, email, phone, about, address, whatsapp } = req.body;
    try {

        // Check if tenant with the same email or phone already exists
        const existingTenant = await Tenant.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingTenant) {

            return res.render('error', { layout: false, error: "An account already exists with the provided email or phone number." });
        }


        const hashedPassword = await bcrypt.hash(phone, 10);

        const tenant = await Tenant.create({
            tenant_id: uuidv4(),
            full_name, email, phone,
            password_hash: hashedPassword, address, whatsapp, about
        });
        const messages = {
            from: {
                name: 'Sun Planet Company'
            },
            to: email,
            subject: "Welcome to Sun Planet Company – Your Property Management Partner!",
            text: `
    Dear ${full_name},</p>
    Welcome to Sun Planet Company Ltd., where we are committed to making property management seamless for you!</p>
    In order to enjoy our premium services, your account has been successfully created. For your convenience, your phone number <strong>${phone}</strong> has been set as your initial password. However, for your security, we strongly recommend updating it to a more secure password at your earliest convenience.</p>
    Here’s how you can update your password:

    Log in to your account at <a href="http://sunplanet.ng/login-tenant">http://sunplanet.ng/login-tenant</a>.
    Navigate to the "Profile" or "Account Settings" section.
    Select "Change Password" and follow the prompts.
    
    We’re here to ensure your rental experience is smooth and hassle-free. Feel free to contact us for any inquiries or assistance.
    
    Thank you for choosing Sun Planet Company!</p>
    Warm regards,<br>The Sun Planet Team</p>
Contact Us: <a href="http://sunplanet.ng">http://sunplanet.ng</a> | <a href="https://wa.me/8101631008">WhatsApp</a> | +234 706 623 1523</p>`
 };

        // Send email
        mail.sendIt(messages);
        // res.status(201).json({ message: "Tenant created successfully", tenant });
        res.redirect("/spco/tenantz")
    } catch (error) {
        console.log('The erro is ', error)
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
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        // res.json(tenants);

        const notice = [];
        const users = tenants;
        const acct_type = 'Tenants';
        return res.render('admin-users-type', { users, userData, notice, acct_type })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE TENANT
exports.getTenantById = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ error: "Tenant not found" });

        // res.json(tenant);
        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);

        const notice = [];
        const user = tenant.dataValues;
        delete user.password_hash
        return res.render('admin-users-tenant', { user, userData, notice })

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
