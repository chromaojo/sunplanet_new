const HelpDesk = require("../models/HelpDesk");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// CREATE A HELP DESK TICKET
exports.createHelpDesk = async (req, res) => {
    try {
        const { name, account_id, number, title, complain, user_id, date, time } = req.body;
        const newHelpDesk = await HelpDesk.create({
            report_id: uuidv4(),
            name,
            account_id,
            number,
            title,
            complain,
            user_id,
            date,
            time,
        });

        res.status(201).json({ message: "HelpDesk ticket created successfully", helpDesk: newHelpDesk });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL HELP DESK TICKETS
exports.getAllHelpDeskAd = async (req, res) => {
    try {
        const helpDesks = await HelpDesk.findAll();
        // res.json(helpDesks);


        const userData = jwt.verify(req.cookies.admin, process.env.JWT_SECRET);
        const notice = []

        res.render('admin-help', { userData, notice, helpDesks })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET ALL HELP DESK TICKETS
exports.getAllMyHelp = async (req, res) => {
    const userData = jwt.verify(req.cookies.investor, process.env.JWT_SECRET);
    const investor_id = userData.investor_id ;
    try {
        const helpDesks = await HelpDesk.findAll({ where: { user_id: investor_id } });
        // res.json(helpDesks);


        const notice = []

        res.render('invest-help', { userData, notice, helpDesks })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET A SINGLE HELP DESK TICKET
exports.getHelpDeskById = async (req, res) => {
    try {
        const helpDesk = await HelpDesk.findByPk(req.params.id);
        if (!helpDesk) return res.status(404).json({ error: "HelpDesk ticket not found" });

        // res.json(helpDesk);

        const help = helpDesk.dataValues
        const userData = jwt.verify(req.cookies.investor, process.env.JWT_SECRET);
        const notice = []

        console.log('The detail is ', help)
        res.render('invest-help1', { userData, notice, help })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE HELP DESK TICKET STATUS
exports.updateHelpDesk = async (req, res) => {
    try {
        const { status, title, complain } = req.body;
        const helpDesk = await HelpDesk.findByPk(req.params.id);

        if (!helpDesk) return res.status(404).json({ error: "HelpDesk ticket not found" });

        await helpDesk.update({ status, title, complain });

        res.json({ message: "HelpDesk ticket updated successfully", helpDesk });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE A HELP DESK TICKET
exports.deleteHelpDesk = async (req, res) => {
    try {
        const helpDesk = await HelpDesk.findByPk(req.params.id);
        if (!helpDesk) return res.status(404).json({ error: "HelpDesk ticket not found" });

        await helpDesk.destroy();
        res.json({ message: "HelpDesk ticket deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
