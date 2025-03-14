const db = require('../config/db');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


exports.AvoidIndex = (req, res, next) => {

    let userData = req.cookies.tenant || req.cookies.admin || req.cookies.investor
    // const userData = jwt.verify(exp1, process.env.JWT_SECRET);


    if (userData) {
        
        let error = 'You are Currently logged In';
        return res.render('error', { userData, error })

    } else {
        return next();
    }
};

exports.TenantLoggin = (req, res, next) => {

    const userCookie = jwt.verify(req.cookies.tenant, process.env.JWT_SECRET);


    if (userCookie.acct_type === 'tenant') {
        return next();

    } else {
        return res.status(401).redirect('/logout');
    }
};

exports.AdminRole = async (req, res, next) => {


    const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);

    if (userData.acct_type === "admin" || 'staff') {
        return next();
    } else { 
        res.redirect('/logout')
    }
};


exports.InvestorRole = async (req, res, next) => {

    const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);

    if (userData.acct_type === 'investor') {
        return next();

    } else {
        return res.status(401).redirect('/logout');
    }
};