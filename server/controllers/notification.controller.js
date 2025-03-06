const Notification = require("../models/Notification");
const User = require("../models/User");

// CREATE A NOTIFICATION
exports.createNotification = async (req, res) => {
    try {
        const { title, content, time, link, user_id } = req.body;

        // Ensure user exists before creating notification
        const userExists = await User.findByPk(user_id);
        if (!userExists) return res.status(404).json({ error: "User not found" });

        const notification = await Notification.create({ title, content, time, link, user_id });

        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL NOTIFICATIONS
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE NOTIFICATION
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) return res.status(404).json({ error: "Notification not found" });

        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE NOTIFICATION STATUS
exports.updateNotification = async (req, res) => {
    try {
        const { status, title, content, link } = req.body;
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) return res.status(404).json({ error: "Notification not found" });

        await notification.update({ status, title, content, link });

        res.json({ message: "Notification updated successfully", notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE A NOTIFICATION
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) return res.status(404).json({ error: "Notification not found" });

        await notification.destroy();
        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
