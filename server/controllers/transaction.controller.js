const Transaction = require("../models/Transaction");

// CREATE A TRANSACTION
exports.createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL TRANSACTIONS
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE TRANSACTION BY ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE A TRANSACTION
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        await transaction.update(req.body);
        res.json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE A TRANSACTION
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        await transaction.destroy();
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
