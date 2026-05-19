const analyzeComplaint = require("../utils/aiHelper");

const aiAnalyze = async (req, res) => {
  try {

    const { description } = req.body;

    const result = await analyzeComplaint(description);

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  aiAnalyze
};