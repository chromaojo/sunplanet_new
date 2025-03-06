const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PropertyType = sequelize.define("PropertyType", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    prop_type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
    tableName: "property_type",
});

module.exports = PropertyType;

