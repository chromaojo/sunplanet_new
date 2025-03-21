const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();




// loginAdmin 

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if admin exists
        const admore = await Admin.findOne({ where: { email } });
        
        if (!admore) {
            const error = "Admin account not found"
            // return res.status(404).json({ error: "Admin not found" });
            return res.render('error-home',{error, layout: false})
        }
        const admin = admore.dataValues

       
        // Check password
        const validPassword = await bcrypt.compare(password, admin.password_hash);
        // if (!validPassword) {
        //     // return res.status(400).json({ error: "Invalid credentials" });
        //     let error = "Check Password & Email Again";
        //     return res.render('error-home', { error, layout: false })
        // }
        
        delete admin.password_hash
        admin.acct_type = "admin";
                
        // Generate JWT Token
        const token = jwt.sign(admin, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Set HTTP-only cookie
        res.cookie("admin", token, { httpOnly: true });
        // res.json({ message: "Login successful", token, admin });
        res.redirect('/spco')

    } catch (error) {
        console.log("The error is ", error)
        res.status(500).json({ error: error.message });
    }
};


// LOGOUT ADMIN
 
exports.logoutAdmin = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
};

// GET ADMIN PROFILE (PROTECTED)

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.admin.id, {
            attributes: { exclude: ["password_hash"] },
        });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// CREATE ADMIN
exports.createAdmin = async (req, res) => {
    try {
        const { full_name, email, phone, role } = req.body;

        const hashedPassword = await bcrypt.hash(phone, 10);

        const newAdmin = await Admin.create({
            full_name,
            email,
            phone,
            password_hash: hashedPassword,
            role,
        });
        
        // res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
        res.redirect('/spco/admins')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL ADMINS
exports.getAllAdmins = async (req, res) => {

    try {
        const users = await Admin.findAll();
       
         const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        // res.json(admins);
        const acct_type = 'Admins';
        const notice = []
        return res.render('admin-users-type', {users, userData, notice, acct_type })

       
    } catch (error) {
        console.log("this is an error ",error)
        res.status(500).json({ error: error.message });
    }
};

// GET ADMIN BY ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        // res.json(admin);

                const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
                const notice = [];
                const user = admin.dataValues;
                delete user.password_hash
                return res.render('admin-users-admin', { user, userData, notice})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE ADMIN
exports.updateAdmin = async (req, res) => {
    try {
        const { full_name, email, phone, role } = req.body;

        const admin = await Admin.findByPk(req.params.id);
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        await admin.update({ full_name, email, phone, role });

        res.json({ message: "Admin updated successfully", admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE ADMIN
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.id);
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        await admin.destroy();
        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
