const express = require('express');
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');


// MiDDLE WARES 
// Configure multer for file storage in 'prop' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/prop/');
        // cb(null, path.join(__dirname, 'prop'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 4 // Limiting the number of files to 4
    }
}).array('pixz', 4);






// To View All Properties
const allProp = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const user_id = userCookie.user_id;

    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProp = await new Promise((resolve, reject) => {

            const sqls = `SELECT * FROM sun_planet.spc_property ORDER BY id DESC;`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userData = userCookie
        return res.render('index', { userData, userProp, info, notice });
    } else {
        return res.status(401).redirect('/logout');
    }
};


// To View All Properties
const allAdProp = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProp = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property ORDER BY id DESC;`;
            db.query(sqls, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userData = userCookie
        return res.render('admin-index', { userData, userProp, info, notice });


    } else {
        return res.status(401).redirect('/logout');
    }
};


// To view only one property 
const oneProp = async (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {

        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProps = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProp = userProps[0];
        return res.render('prop-one', { userData, userProp, info, notice });

    }
};

// To view Admin Prop 
const oneAdProp = async (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {

        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProps = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProp = userProps[0];
        return res.render('admin-prop-one', { userData, userProp, info, notice });

    }
};

const editProp = async (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const user_id = userCookie.user_id;
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {

        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProps = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM sun_planet.spc_property WHERE id =?;`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userProp = userProps[0];
        return res.render('admin-prop-edit', { userData, userProp, info, notice });

    }
};



// To Post property form from the frontend 
const updateProp = async (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userData = userCookie;
    const id = req.params.id;

    if (!userData) {
        return res.status(401).send("Unauthorized access.");
    }

    try {
        const {
            property_name, youtube, lease_status, description, property_type,
            rent_price, number_of_units, address, bedrooms, bathrooms, city,
            state, size_in_sqft
        } = req.body;

        // Validate required fields
        if (!property_name || !address || !city || !state || !bedrooms || !bathrooms || !size_in_sqft) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const country = 'Nigeria';

        // Update property in the database
        const updateQuery = `
            UPDATE sun_planet.spc_property
            SET property_name = ?, youtube = ?, lease_status = ?, property_type = ?, 
                rent_price = ?, number_of_units = ?, address = ?, bedrooms = ?, bathrooms = ?, 
                city = ?, state = ?, size_in_sqft = ?, country = ?, description = ?
            WHERE id = ?`;
        
        const updateValues = [
            property_name, youtube, lease_status, property_type, rent_price,
            number_of_units, address, bedrooms, bathrooms, city, state,
            size_in_sqft, country, description, id
        ];
     

        db.query(updateQuery, updateValues);

        // Retrieve all user IDs to create notifications

        const users = await new Promise((resolve, reject) => {
            const sqls = `SELECT user_id FROM sun_planet.spc_users`;
            db.query(sqls, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        console.log('users are ',users)
        const title = 'Property Update ';
        const content = 'An existing property has just been updated. Click to view details and explore the latest listings!';
        const linkBase = userData.role === 'client' ? '/user/property-zZkKqQP/' : '/admin/property-zZkKqQP/';
        const link = `${linkBase}${id}`;

        // Insert notifications into spc_notification table
        const notifications = users.map(user => [user.user_id, title, content, link]);
        const notificationQuery = `
            INSERT INTO sun_planet.spc_notification (user_id, title, content, link)
            VALUES ?`;

        db.query(notificationQuery, [notifications]);

        console.log(`Inserted ${notifications.length} notifications.`);

        // Redirect based on user role
        const redirectPath = userData.role === 'client' ? '/user/props' : '/admin/props';
        return res.redirect(redirectPath);
    } catch (error) {
        console.error('Property Update Error:', error);
        return res.status(500).json({ error: 'An error occurred while updating the property.' });
    }
};




// To Post property form from the frontend 
const createProp = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }


            const { property_name, youtube, lease_status, description, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, } = req.body;


            const prop_id = Math.floor(Math.random() * 999999);
            const country = 'Nigeria'
            const pixz = req.files.map(file => file.filename);
            const picture = '' + pixz + "";

            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO sun_planet.spc_property SET ?', { property_name, youtube, prop_id, picture, lease_status, property_type, rent_price, number_of_units, address, bedrooms, bathrooms, city, state, size_in_sqft, country, description, });
            // To create Alert for every user when property is created 

            db.query('SELECT user_id FROM sun_planet.spc_users', (err, results) => {
                if (err) {
                    console.error('Failed to retrieve user IDs:', err);
                    return res.status(500).json({ error: 'Database error.' });
                }

                const title = 'New Property !!!';
                const content = ' A new property has been added to the dashboard. Click to view details and explore the latest listings!'
                const link = '/'
                const notifications = results.map(user => ({
                    user_id: user.user_id,
                    title,
                    content,
                    link,
                }));

                // Insert notifications into spc_notification table
                const query = 'INSERT INTO sun_planet.spc_notification (user_id, title, content, link) VALUES ?';
                const values = notifications.map(({ user_id, title, content, link }) => [user_id, title, content, link]);

                db.query(query, [values], (err, result) => {
                    if (err) {
                        console.error('Failed to insert notifications:', err);
                        return res.status(500).json({ error: 'Database error.' });
                    }

                    console.log(`Inserted ${result.affectedRows} notifications.`);
                    if (userCookie.role === 'client') {
                        res.redirect('/user/props');
                    } else {
                        res.redirect('/admin/props');
                    }
                });
            });

        });

    } catch (error) {
        console.log('Property Form Error :', error)
    }

}




// To delete a property content
const deleteProp = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;

            // Perform the deletion
            const sql = `DELETE FROM sun_planet.spc_property WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {

                    return res.status(500).send('Error deleting Property');
                }
                res.redirect('/admin/props')
            });


        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Property')
    }
};


// To View All Properties
const allFiltProp = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const { filter } = req.body

    if (filter) {

        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const userProp = await new Promise((resolve, reject) => {

            const sqls = `SELECT * FROM sun_planet.spc_property WHERE property_type = ? ORDER BY id DESC;`;
            db.query(sqls, [filter], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userData = userCookie
        return res.render('index', { userData, userProp, info, notice });
    } else {
        if (userCookie.role === 'client') {
            res.redirect('/user/dashboard');
        } else {
            res.redirect('/admin/dashboard');
        }
    }
};

// To View All Properties
const allSearchProp = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const { query } = req.body

    if (userCookie) {

        const notice = await new Promise((resolve, reject) => {
            const status = 'unread'
            const user_id = userCookie.user_id;
            const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
            db.query(sqls, [user_id, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const userProp = await new Promise((resolve, reject) => {

            const sql = `
            SELECT *
            FROM sun_planet.spc_property
            WHERE property_name LIKE '%${query}%' 
            OR description LIKE '%${query}%'
            OR address LIKE '%${query}%'
            OR city LIKE '%${query}%' ORDER BY id DESC;
        `;


            db.query(sql, [query], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const userData = userCookie
        return res.render('index', { userData, userProp, info, notice });
    } else {
        return res.status(401).redirect('/logout');
    }
};



module.exports = { oneProp, oneAdProp, allProp, editProp, allAdProp, updateProp, deleteProp, createProp, allFiltProp, allSearchProp }
