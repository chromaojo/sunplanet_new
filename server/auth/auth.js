const db = require('../config/db');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


exports.AvoidIndex = (req, res, next) => {
    const { tenant, admin, investor } = req.cookies;

    let userData;
    let userRole = null;

    try {
        if (tenant) {
            userData = jwt.verify(tenant, process.env.JWT_SECRET);
            userRole = 'tenant';
        } else if (investor) {
            userData = jwt.verify(investor, process.env.JWT_SECRET);
            userRole = 'investor';
        } else if (admin) {
            userData = jwt.verify(admin, process.env.JWT_SECRET);
            userRole = 'admin';
        }
    } catch (err) {
        return next(); // Invalid token, proceed normally
    }

    if (userData) {
        switch (userRole) {
            case 'tenant':
                return res.redirect('/tnt');
            case 'investor':
                return res.redirect('/invst');
            case 'admin':
                return res.redirect('/spco');
            default:
                return next();
        }
    }

    return next();
};

exports.TenantLoggin = (req, res, next) => {

    try {
        const userCookie = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);
        if (userCookie.acct_type === 'tenant') {
            return next();
        } else {
            return res.status(401).redirect('/logout');
        }
    } catch (error) {
        return res.status(400).redirect('/logout');
    }};

    
    exports.AdminRole = async (req, res, next) => {
        try {
            const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);

            if (userData.acct_type === "admin" || userData.acct_type === "staff") {
                return next();
            } else {
                return res.redirect('/logout');
            }
        } catch (error) {
            return res.redirect('/logout'); // Handle token verification failure
        }
    };



    exports.InvestorRole = async (req, res, next) => {

        try {
            const userData = jwt.verify(req.cookies.investor, process.env.JWT_SECRET);
            if (userData.acct_type === 'investor') {
                return next();
            } else {
                return res.status(401).redirect('/logout');
            }
        } catch (error) {
            return res.status(401).redirect('/logout');
        }
    };