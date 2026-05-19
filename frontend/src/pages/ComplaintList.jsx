import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ComplaintCard from "../components/ComplaintCard";
import { Link } from "react-router-dom";

const ComplaintList = () => {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await API.get("/complaints");
    setComplaints(res.data);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <div>
            <h2 className="text-2xl font-semibold mb-1">All Complaints</h2>
            <p className="text-gray-600 mb-0">Review recent complaints and use AI-powered suggestions to prioritize responses.</p>
          </div>
          <Link to="/add-complaint" className="bg-indigo-600 text-white px-4 py-2 rounded">Submit Complaint</Link>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white shadow rounded p-4 text-center text-gray-500">No complaints found. Add your first complaint to get started.</div>
        ) : (
          complaints.map((item) => (
            <ComplaintCard key={item._id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintList;