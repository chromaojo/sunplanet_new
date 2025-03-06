const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SavedProperty = sequelize.define("SavedProperty", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    archive_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    save_type: {
        type: DataTypes.ENUM("investment", "property"),
        allowNull: false,
    },
    prop_link: {
        type: DataTypes.STRING,
    },
    user_id: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: "archive",
});

module.exports = SavedProperty;
