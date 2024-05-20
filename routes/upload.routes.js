const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const { uploadCardImages } = require("../multer-config");

router.post("/upload", uploadCardImages, cardController.uploadCard);

module.exports = router;
