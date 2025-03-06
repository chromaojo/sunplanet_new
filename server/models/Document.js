const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define("Document", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipient_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    document_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    document_url: {
        type: DataTypes.STRING,
    },
    document_size: {
        type: DataTypes.INTEGER,
    },
    transfer_status: {
        type: DataTypes.ENUM("Pending", "In Progress", "Completed", "Failed"),
        defaultValue: "Pending",
    },
    transfer_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
    tableName: "dorkument",
});

module.exports = Document;
