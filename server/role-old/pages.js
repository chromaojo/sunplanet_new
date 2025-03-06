const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const info = require('../config/info')
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "rEs" + random;
const session = require('express-session');
const { AvoidIndex, UserLoggin } = require('../auth/auth');
const { regNew, regSamp } = require('../module/accounts')


route.use(
    session({
        secret: `Hidden_Key`,
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

// Properties Section 

// To get All property 
route.get('/prop', AvoidIndex, (req, res) => {
    const property_type = req.params.type;
    const sql = `
    SELECT * FROM sun_planet.spc_property ORDER BY id DESC;
  `;
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
    const sql = `SELECT * FROM sun_planet.spc_property WHERE property_type = ? ORDER BY id DESC;`;
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



// About Section 
route.get('/about', AvoidIndex, (req, res) => {

    res.render('home-about', { info, layout: false })
})

route.get('/contact', AvoidIndex, (req, res) => {

    res.render('home-contact', { info, layout: false })
})


route.get('/blog', (req, res)=>{
    const userBlog = ''
    res.render('home-blog',{userBlog, layout: false });
})

route.get('/sampler', regSamp)

// Implement save investment 


// To Login User
route.get('/login', AvoidIndex, (req, res) => {

    res.sendFile(path.join(__dirname, "../../statics", 'login.html'));
})


// Login route
route.post('/nXcLl/login', async (req, res) => {

    const { email, password } = req.body;

    // Check if the user and account details with the provided email exists
    const sqlGetUserWithAccount = `
       SELECT *
       FROM sun_planet.spc_users u
       LEFT JOIN sun_planet.spc_accounts a ON u.user_id = a.user_id
       WHERE u.email = ?;
     `;
    db.query(sqlGetUserWithAccount, [email], async (err, result) => {
        if (err) {

            const error = 'Internal Server Login Error'
            return res.render('error-home', { error, layout: false  })

        }

        if (result.length === 0) {
            const error = "Invalid Email or Password"
            return res.render('error-home', { error , layout: false  })

        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) {
            // Password is invalid
            const error = "Invalid Email or Password"
            return res.render('error-home', { error  , layout: false  })

        }

        // Create a means through which the admin is routed to admin.js 
        // and customer to where they belong 

        req.app.set('userData', result[0])
        let ans = result[0];
        delete ans.password
        const userWithAccount = ans;
        console.log('The details are ', ans)
        res.cookie('user', JSON.stringify({ ...userWithAccount }));

        if (result[0].role === 'client') {
            res.redirect('/user/dashboard');
        } else {
            res.redirect('/admin/dashboard');
        }
    });
});

// Logout route
route.get('/logout', (req, res) => {

    delete userCookie
    req.session.destroy((err) => {
        delete userData
        delete userCookie
        res.clearCookie('user');
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});





module.exports = route;