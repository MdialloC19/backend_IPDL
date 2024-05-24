const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card.controller");
const { uploadCardImages } = require("../middlewares/multerConfig");

router.post("/upload", uploadCardImages, cardController.uploadCard);

module.exports = router;
