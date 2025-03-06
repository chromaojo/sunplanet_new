const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rent = sequelize.define("Rent", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    property_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    property_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    occupant_name: {
        type: DataTypes.STRING(255),
    },
    occupant_phone: {
        type: DataTypes.STRING(255),
    },
    next_of_kin: {
        type: DataTypes.STRING(255),
    },
    kin_address: {
        type: DataTypes.STRING(255),
    },
    kin_phone: {
        type: DataTypes.STRING(255),
    },
    unit: {
        type: DataTypes.INTEGER,
    },
    duration: {
        type: DataTypes.STRING(255),
    },
    rent_start_date: {
        type: DataTypes.DATE,
    },
    rent_end_date: {
        type: DataTypes.DATE,
    },
    user_id: {
        type: DataTypes.STRING,
    },
    comment: {
        type: DataTypes.TEXT,
    },
    rent_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("approved", "reject", "pending"),
        defaultValue: "pending",
    },
}, {
    timestamps: true,
    tableName: "rent",
});

module.exports = Rent;
