const express = require("express");
// import middleware from "../middlewares/auth.middleware.js";
const optimisation = require("../controllers/optimisation");
const router = express.Router();

router.post("/post", optimisation);

module.exports = router;
