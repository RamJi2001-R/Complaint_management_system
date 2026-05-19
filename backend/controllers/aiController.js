const analyzeComplaint = require("../utils/aiHelper");

const aiAnalyze = async (req, res) => {
  try {

    const { title, description, category, location } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required for AI analysis." });
    }

    const result = await analyzeComplaint({ title, description, category, location });

    res.json(result);

  } catch (error) {
    console.error("[aiController] Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { aiAnalyze };