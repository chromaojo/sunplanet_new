const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Investor = require("./Investor"); // Assuming Investor model exists

const InvestPortfolio = sequelize.define("InvestPortfolio", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    investor_id: { 
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        references: { model: Investor, key: "investor_id" }, 
        onDelete: "CASCADE" 
    },
    investment_amount: { type: DataTypes.DECIMAL, allowNull: false },
    investment_plan: { type: DataTypes.STRING, allowNull: false },
    investment_duration: { type: DataTypes.STRING, allowNull: false },
    picture: { type: DataTypes.STRING, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_Date: { type: DataTypes.DATE, allowNull: true },
    expected_return: { type: DataTypes.DECIMAL },
    status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
}, {
    timestamps: true,
    tableName: "invest_portfolio",
});

module.exports = InvestPortfolio;
