const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  aiPriority: {
    type: String,
    default: "Medium"
  },

  aiDepartment: {
    type: String
  },

  aiSummary: {
    type: String
  },

  aiResponse: {
    type: String
  },

  aiSentiment: {
    type: String,
    default: "Neutral"
  },

  aiUrgencyScore: {
    type: Number,
    default: 5
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);