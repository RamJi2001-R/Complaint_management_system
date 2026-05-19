const Complaint = require("../models/Complaint");

const addComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.create(req.body);

    res.status(201).json({
      message: "Complaint Added Successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find();

    res.json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint Not Found"
      });
    }

    complaint.status = req.body.status;

    await complaint.save();

    res.json({
      message: "Status Updated",
      complaint
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const searchComplaint = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      location: req.query.location
    });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  updateComplaintStatus,
  searchComplaint
};