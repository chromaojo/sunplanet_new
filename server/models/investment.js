const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Investment = sequelize.define(
    "Investment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        property_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        investment_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        expected_return: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        investment_duration: {
            type: DataTypes.INTEGER, // in months
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "active", "closed"),
            defaultValue: "pending",
        },
    },
    {
        timestamps: true,
        tableName: "investments",
    }
);

module.exports = Investment;
