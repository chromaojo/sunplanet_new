const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const fs = require('fs');
const pdf = require('html-pdf-node');
const { title } = require('process');
const { time } = require('console');



const pdfTrans = async (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const notice = await new Promise((resolve, reject) => {
        const status = 'unread'
        const user_id = userData.user_id;
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
  
    // Create PDF options
    const pdfOptions = { format: 'A5' };
    // Generate PDF from HTML
    pdf.generatePdf({ content: 'trans-one receiept' }, pdfOptions).then(buffer => {
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');

        // Send PDF as response
        res.send(buffer);
    }).catch(pdfErr => {
        console.error(pdfErr);
        res.status(500).send("Error generating PDF");
    });
    // Render the EJS file to HTML
};



const myTrans = async (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = userCookie.user_id
    const notice = await new Promise((resolve, reject) => {
        const status = 'unread'
        const user_id = userCookie.user_id;
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
    const sql = `
    SELECT * FROM sun_planet.spc_transaction WHERE user_id = ? ORDER BY transaction_id DESC;
  `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Login Issues :', err);
            return res.status(500).send('Internal Server Error');
        }


        if (results) {

            const userTran = results

            const userData = userCookie
            return res.render('transaction', { userData, userTran, notice })

        }

    })
}



// To View All Properties
const allTrans = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const notice = await new Promise((resolve, reject) => {
        const status = 'unread'
        const user_id = userCookie.user_id;
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

    if (userCookie) {
        const sql = `
      SELECT * FROM sun_planet.spc_transaction ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userTrans = results
                const userData = userCookie
                return res.render('index', { userData, userTrans, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};


// To view only one Transaction 
const oneTrans = async (req, res) => {
    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    if (!userCookie) {
        return res.redirect('/logout');
    }

    try {
        // Fetch unread notifications
        const notice = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM sun_planet.spc_notification 
                         WHERE user_id = ? AND status = ? ORDER BY id DESC`;
            db.query(sql, [userCookie.user_id, 'unread'], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // Fetch transaction details
        const transaction = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM sun_planet.spc_transaction WHERE transaction_id = ?`;
            db.query(sql, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Assuming only one transaction matches
            });
        });

        if (!transaction) {
            const error = "Invalid Transaction. Please Contact The Admin";
            return res.render('error', { userData: userCookie, error, notice });
        }

        const userTrans = transaction;

        // Create PDF options
        const pdfOptions = { format: 'A5' };

        const myXyz = `
        
          <section class="section" style="padding: 5%;">
          <div style="text-align: center;">
          <h2> SUN PLANET CO - Transaction Receipt </h2>
          <img src="/asset/img/logo.png" alt="Company Logo">
          </div>
          <br> 
    <div class="row"> <br>
      <div class="col-lg-12">


        <div class="card p-2 w-100 "> 
          <div class="card-body">
            <h5 class="card-title p-4">Transaction ID:  ${userTrans.reference_number} </h5>

            <div class="row">

              <div class="col">
                <!-- List group With Icons -->
                <table class="list-group">
                  <tr class="list-group-item"><i class="bi bi-exclamation-octagon me-1 text-warning"></i> 
                  <td> Reference Number : </td> <td> ${userTrans.reference_number} </td>
                  </tr>
                  <tr class="list-group-item text-capitalize"><i class="bi bi-star me-1 text-success"></i>
                  <td>Credited :</td> <td> ${userTrans.name} </td>
                  </tr>
                  <tr class="list-group-item text-capitalize"><i class="bi bi-collection me-1 text-primary"></i>
                  <td> Status : </td> <td> ${userTrans.status}  </td>
                  </tr>
                  <tr class="list-group-item text-capitalize"><i class="bi bi-check-circle me-1 text-danger"></i>
                  <td> Amount :  </td> <td> ${userTrans.amount} NGN </td>
                  </tr>
    
                  <tr class="list-group-item"><i class="bi bi-exclamation-octagon me-1 text-warning"></i>
                  <td> Issued By : </td> <td> ${userTrans.created_by} </td>
                  </tr>
                  <tr class="list-group-item"><i class="bi bi-collection me-1 text-primary"></i>
                  <td> Payment : </td> <td> ${userTrans.payment_method} </td>
                  </tr>
                  <tr class="list-group-item"><i class="bi bi-exclamation-octagon me-1 text-warning"></i> 
                    <td>Transaction Date : </td>  
                    <td>  ${new Date(userTrans.created_at).toLocaleString('en-GB', {
            year: 'numeric', month: 'long',
            day: '2-digit'
        })} </td>
                   
                  </tr>
                  <tr class="list-group-item"><i class="bi bi-check-circle me-1 text-danger"></i> 
                  <td> Transaction Time :  </td> 
                      <td> ${new Date(userTrans.created_at).toLocaleTimeString()} </td>
                  </tr>
                </table><!-- End List group With Icons -->
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </section>
        `
        // Generate PDF from HTML
        pdf.generatePdf({ content: myXyz }, pdfOptions).then(buffer => {
            // Set response headers 
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="transaction.pdf"');

            // Send PDF as response
            res.send(buffer);
        }).catch(pdfErr => {
            console.error(pdfErr);
            res.status(500).send("Error generating PDF");
        });


    } catch (error) {
        console.error("Error processing request:", error);
        const errorMsg = "An error occurred while fetching transaction details. Please try again.";
        res.render('error', { userData: userCookie, error: errorMsg, notice: [] });
    }
};




// To Get Transaction form 
const makeTrans = async (req, res) => {

    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const { account_id } = req.body;
    const notice = await new Promise((resolve, reject) => {
        const status = 'unread'
        const user_id = userData.user_id;
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });


    if (userData) {
        const sql = `
        SELECT * FROM sun_planet.spc_accounts WHERE account_id =?;
      `;

        db.query(sql, [account_id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userTranz = results[0]
                const myref = Math.floor(Math.random() * 99989999);
                const refs = random * myref;
                console.log('Details are ', userTranz)
                res.render('tranz', { userData, userTranz, notice, refs });
            }
        });

    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To Post shipment form from the frontend 
const postTrans = async (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie;
    const transaction_type = 'credit';
    const created_by = userData.surname + " " + userData.othername + ' | ' + userData.email

    const { name, description, amount, user_id, payment_method, reference_number } = req.body;
    const notice = await new Promise((resolve, reject) => {
        const status = 'unread'
        const user_id = userCookie.user_id;
        const sqls = `SELECT * FROM sun_planet.spc_notification WHERE user_id = ? AND status = ? ORDER BY id DESC;`;
        db.query(sqls, [user_id, status], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });


    try {
        // Only one refrence number is allowed. No duplicate

        const status = 'completed';
        db.query('INSERT INTO sun_planet.spc_transaction SET ?', { name, description, amount, user_id, payment_method, reference_number, transaction_type, created_by, status });

        // Select the account and add the new ammount to the users Balance and Total Spent 


        const tot = await new Promise((resolve, reject) => {


            const sqls = `SELECT total_spent FROM sun_planet.spc_accounts WHERE user_id =?;`;
            db.query(sqls, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const old_total_spent = tot[0].total_spent
        const newAmount = parseFloat(amount)

        const total_spent = old_total_spent + newAmount

        db.query('UPDATE sun_planet.spc_accounts SET total_spent = ?  WHERE user_id = ?', [total_spent, user_id]);
        const title = "Transaction Balance"
        const content = 'A sum of ' + amount + ' NGN has been added to your transaction balance'
        console.log('Total Spent is ', total_spent)

        if (userData.role === 'admin') {
            const link = '/admin/transactions'
            db.query('INSERT INTO sun_planet.spc_notification SET ?', { title, content, time, user_id, link });

            res.redirect('/admin/transactions')
        } else {
            const link = '/user/transactions'
            db.query('INSERT INTO sun_planet.spc_notification SET ?', { title, content, time, user_id, link });

            res.redirect('/user/transactions')
        }
    } catch (err) {

        // res.send('Transaction error')
        const error = "Transaction Based Error"

        return res.render('error', { userData, error, notice })
    }


}




// To delete a Transaction content


const deleteTrans = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM jvmc.re_transaction WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting Transaction:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('Transaction content not found');
                }

            });

            return next();
        } catch (err) {
            console.error('Error handling transactions ', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Transaction')
    }
};



module.exports = { oneTrans, allTrans, pdfTrans, deleteTrans, postTrans, makeTrans, myTrans }
