const express = require('express');
const path = require('path');
const app = express();
const port = 7088;
const sequelize = require("./server/config/db");
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { TenantLoggin, AvoidIndex, InvestorRole, AdminRole,  } = require('./server/auth/auth');
const session = require('express-session');
require('dotenv').config();





app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(cookieParser());


app.use(
    session({
        secret: process.env.HIDDEN_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);



app.use('', require('./server/role/front'));
app.use('/spco', AdminRole , require('./server/role/admin'));
app.use('/tnt', TenantLoggin, require('./server/role/tenant'));
app.use('/invst', InvestorRole, require('./server/role/investor'));

// app.use('/admin', AdminRoleBased, require('./server/routes/admin'));
// app.use('/user', ClientRole, require('./server/routes/customer'));
 

app.all("*", (req, res)=>{
    res.send("This page is not accesible to you")
})

// Sync Database and Start Server { alter : true }
sequelize.sync().then(() => {
    console.log("Database synced!"); 
});

 

app.listen(port, ()=>{
    console.log(`App Running on ${port}`);
})