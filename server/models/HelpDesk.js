const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const HelpDesk = sequelize.define("HelpDesk", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    report_id: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_id: {  
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
    },
    title: {
        type: DataTypes.STRING,
    },
    complain: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.ENUM("pending", "resolved"),
        defaultValue: "pending",
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
    },
    time: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
    tableName: "help_desk",
});

module.exports = HelpDesk;
