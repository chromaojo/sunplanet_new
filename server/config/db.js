const { Sequelize } = require('sequelize');
require('dotenv').config();


// Validate environment variables
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_HOST) {
    throw new Error("Database environment variables are not properly set.");
}


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    waitForConnections: true,
    logging: process.env.NODE_ENV === 'production' ? console.log : false, // Enable logging in dev
});

console.log('Database Connected')


module.exports = sequelize;











