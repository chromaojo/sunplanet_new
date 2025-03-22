const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const info = require('../config/info');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "rEs" + random;
const session = require('express-session');
const { AvoidIndex, UserLoggin } = require('../auth/auth');
const { regNew, regSamp } = require('../module/accounts');
const {loginAdmin , logoutAdmin} = require('../controllers/admin.controller')
const {loginTenant, } = require('../controllers/tenant.controller');
const {loginInvestor} = require('../controllers/investor.controller');
const { getAllFrontProp, searchProperty } = require('../controllers/property.controller')
require('dotenv').config();


route.use(
    session({
        secret: process.env.HIDDEN_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);



// route.use('/DxXTWwq', require('../module/payment'));

// Home Page 
route.get('/', AvoidIndex, (req, res) => {

    res.render('home-index', { info, layout: false })
})

// Testimonial Page
route.get('/testimonial', AvoidIndex, (req, res) => {


    res.render('home-testimony', { info, layout: false })
})
// About Section 
route.get('/about', AvoidIndex, (req, res) => {

    res.render('home-about', { info, layout: false })
})
// Investment Details Section 
route.get('/about-invest', AvoidIndex, (req, res) => {

    res.render('home-invest', { info, layout: false })
})

route.get('/contact', AvoidIndex, (req, res) => {

    res.render('home-contact', { info, layout: false })
})


route.get('/blog', AvoidIndex, (req, res)=>{
    const userBlog = ''
    res.render('home-blog',{userBlog, layout: false });
})

route.get('/sampler', regSamp)

// Implement save investment 


// To Login User

// Admin Login 
route.get('/login-admin', AvoidIndex, (req, res) => {
    

    // res.sendFile(path.join(__dirname, "../../statics", 'loginAdmin.html'));

    return res.render('loginAdmin', { layout: false })
})

// Investor Login 

route.get('/login-investor', AvoidIndex, (req, res) => {

    // res.sendFile(path.join(__dirname, "../../statics", 'loginInvest.html'));

    return res.render('loginInvestor', { layout: false })
})
// Tenant Login 
route.get('/login-tenant', AvoidIndex, (req, res) => {

    // res.sendFile(path.join(__dirname, "../../statics", 'loginTenant.html'));

    return res.render('loginTenant', { layout: false })
})

// Admin Login 
route.post('/PxXUlLiKT/login', loginAdmin)
// Tenant Login 

// Investor Login 
route.post('/KjXxXYtF/login', loginInvestor)

// Tenant Login 
route.post('/tTxDiIOzXlO/login', loginTenant)


// Properties Section 

// To get All property 
route.get('/properties', AvoidIndex, getAllFrontProp)

// To search Property 
route.post('/search/prop', AvoidIndex, searchProperty)



// Logout route
route.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        delete userData
        delete userCookie
        res.clearCookie('tenant');
        res.clearCookie('investor');
        res.clearCookie('admin');
        if (err) {
            console.error("The Error is : ",err); 
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});





module.exports = route;