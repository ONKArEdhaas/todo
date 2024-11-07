const express = require("express");
const { gptPostData } = require("../controller/gpt");

const router = express.Router();

router.post("/gpt", gptPostData);

module.exports = router;
