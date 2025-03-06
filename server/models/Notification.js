const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Notification = sequelize.define("Notification", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    time: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM("read", "unread"), defaultValue: "unread" },
    link: { type: DataTypes.STRING },
    user_id: { 
        type: DataTypes.STRING, 
        references: { model: User, key: "user_id" } 
    },
}, {
    timestamps: true,
    tableName: "notification",
});

module.exports = Notification;
