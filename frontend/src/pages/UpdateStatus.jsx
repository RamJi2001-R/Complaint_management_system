import { useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const UpdateStatus = () => {

  const { id } = useParams();

  const [status, setStatus] = useState("");

  const updateStatus = async () => {
    try {
      await API.put(`/complaints/${id}`, {
        status
      });
      alert("Status Updated");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white shadow rounded p-6">
          <h4 className="mb-3 text-lg font-semibold">Update Complaint Status</h4>
          <p className="text-gray-600">Enter a new status to keep the complaint record current.</p>
          <div className="mb-3 mt-4">
            <label className="block text-sm mb-1">Status</label>
            <input className="border rounded px-3 py-2 w-full" type="text" placeholder="Enter Status" onChange={(e) => setStatus(e.target.value)} />
          </div>
          <button className="bg-indigo-600 text-white w-full py-2 rounded" onClick={updateStatus}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;