const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Assuming User model exists

const Transaction = sequelize.define("Transaction", {
    transaction_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { 
        type: DataTypes.STRING, 
        references: { model: User, key: "user_id" } 
    },
    payment_method: { type: DataTypes.STRING },
    amount: { type: DataTypes.DECIMAL(15, 2) },
    name: { type: DataTypes.STRING },
    created_by: { type: DataTypes.STRING },
    transaction_type: { type: DataTypes.ENUM("debit", "credit") },
    status: { type: DataTypes.ENUM("pending", "completed", "failed") },
    description: { type: DataTypes.STRING },
    reference_number: { type: DataTypes.STRING },
}, {
    timestamps: true,
    tableName: "transaction",
});

module.exports = Transaction;
