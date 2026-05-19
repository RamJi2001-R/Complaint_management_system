import { useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Rejected"];

const UpdateStatus = () => {

  const { id }        = useParams();
  const navigate      = useNavigate();
  const [status,     setStatus]    = useState("");
  const [loading,    setLoading]   = useState(false);
  const [success,    setSuccess]   = useState(false);
  const [error,      setError]     = useState("");

  const updateStatus = async () => {
    if (!status) { setError("Please select a status."); return; }
    setLoading(true);
    setError("");
    try {
      await API.put(`/complaints/${id}`, { status });
      setSuccess(true);
      setTimeout(() => navigate("/complaints"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-7">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Update Complaint Status</h1>
          <p className="text-sm text-gray-500 mb-6">Select a new status to update the complaint record.</p>

          {success ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-green-600 font-medium">Status updated successfully!</p>
              <p className="text-xs text-gray-400 mt-1">Redirecting to complaints list…</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setStatus(opt); setError(""); }}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                        status === opt
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                  ⚠️ {error}
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => navigate("/complaints")}
                  className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStatus}
                  disabled={loading || !status}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? "Updating…" : "Update Status"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;