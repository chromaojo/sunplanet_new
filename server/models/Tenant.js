const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Tenant = sequelize.define("Tenant", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tenant_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    full_name: {
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
    },
    address: {
        type: DataTypes.TEXT,
    },
    tenant_balance: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
    },
    total_spent: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    about: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: "tenants",
});

module.exports = Tenant;
