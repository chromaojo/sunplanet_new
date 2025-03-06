const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Investor = sequelize.define("Investor", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    investor_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bank_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bank_acct_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bank_acct: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: DataTypes.TEXT,
    },
    returns : {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
    },
    investment_total: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: "investors",
});

module.exports = Investor;
