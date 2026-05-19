const express = require("express");

const router = express.Router();

const {
  aiAnalyze
} = require("../controllers/aiController");

router.post("/analyze", aiAnalyze);

module.exports = router;