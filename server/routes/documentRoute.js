const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const upload = require("../middleware/uploadMiddleware");

// CRUD Routes
router.post("/", upload.single("document"), documentController.createDocument);
router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);
router.put("/:id", documentController.updateDocument);
router.delete("/:id", documentController.deleteDocument);

module.exports = router;
