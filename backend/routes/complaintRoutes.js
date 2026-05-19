const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addComplaint,
  getComplaints,
  updateComplaintStatus,
  searchComplaint
} = require("../controllers/complaintController");

router.post("/", protect, addComplaint);

router.get("/", protect, getComplaints);

router.put("/:id", protect, updateComplaintStatus);

router.get("/search/location", protect, searchComplaint);

module.exports = router;