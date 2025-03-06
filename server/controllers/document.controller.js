const Document = require("../models/Document");

// CREATE A NEW DOCUMENT
exports.createDocument = async (req, res) => {
    try {
        const { sender_id, recipient_id, document_name, transfer_status, notes } = req.body;
        const document_url = req.file ? `/uploads/${req.file.filename}` : null;
        const document_size = req.file ? req.file.size : null;

        const newDocument = await Document.create({
            sender_id,
            recipient_id,
            document_name,
            document_url,
            document_size,
            transfer_status,
            notes,
        });

        res.status(201).json({ message: "Document created successfully", document: newDocument });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL DOCUMENTS
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.findAll();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET DOCUMENT BY ID
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findByPk(req.params.id);
        if (!document) return res.status(404).json({ error: "Document not found" });

        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE DOCUMENT
exports.updateDocument = async (req, res) => {
    try {
        const { transfer_status, completion_date, notes } = req.body;
        const document = await Document.findByPk(req.params.id);

        if (!document) return res.status(404).json({ error: "Document not found" });

        await document.update({ transfer_status, completion_date, notes });

        res.json({ message: "Document updated successfully", document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE DOCUMENT
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByPk(req.params.id);
        if (!document) return res.status(404).json({ error: "Document not found" });

        await document.destroy();
        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
