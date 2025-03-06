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
const {getAllProperties , getPropertyById } = require('../controllers/property.controller')
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

    res.sendFile(path.join(__dirname, "../../statics", 'loginAdmin.html'));
})

// Investor Login 

route.get('/login-investor', AvoidIndex, (req, res) => {

    res.sendFile(path.join(__dirname, "../../statics", 'loginInvest.html'));
})
// Tenant Login 
route.get('/login-tenant', AvoidIndex, (req, res) => {

    res.sendFile(path.join(__dirname, "../../statics", 'loginTenant.html'));
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
route.get('/prop', AvoidIndex, (req, res) => {
    const property_type = req.params.type;
    const sql = `SELECT * FROM sun_planet.spc_property ORDER BY id DESC;`;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    db.query(sql, [property_type], (err, results) => {
        if (err) {
            console.log('Login Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {
            const userProp = results
            const userData = userCookie
            return res.render('home-prop', { userProp, info, layout: false })
        }

    })

})

// To get specific properties 
route.get('/prop/:type', AvoidIndex, (req, res) => {
    const property_type = req.params.type;
    const sql = `
    SELECT * FROM sun_planet.spc_property WHERE property_type = ? ORDER BY id DESC;
  `;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    db.query(sql, [property_type], (err, results) => {
        if (err) {
            console.log('Property Data Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {
            const userProp = results
            const userData = userCookie
            return res.render('home-prop', { userProp, info, layout: false })
        }

    })

})

route.get('/props/:id', AvoidIndex, (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT * FROM sun_planet.spc_property WHERE id = ? ORDER BY id DESC;
  `;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.log('Login Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {
            const userProp = results[0];
            
            console.log('The user Prop is ', userProp)
            return res.render('home-prop-one', { userProp, info, layout: false })
        }

    })

})


// Logout route
route.get('/logout', (req, res) => {

    delete userCookie
    req.session.destroy((err) => {
        delete userData
        delete userCookie
        res.clearCookie('tenant');
        res.clearCookie('investor');
        res.clearCookie('admin');
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});





module.exports = route;