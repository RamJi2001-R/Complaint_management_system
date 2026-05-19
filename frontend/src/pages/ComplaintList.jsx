import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ComplaintCard from "../components/ComplaintCard";
import { Link } from "react-router-dom";

const ComplaintList = () => {

  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      setError("Failed to load complaints. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.aiPriority === filter;
    return matchSearch && matchFilter;
  });

  // Stats
  const total    = complaints.length;
  const high     = complaints.filter(c => c.aiPriority === "High").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending  = complaints.filter(c => c.status === "Pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Complaints</h1>
            <p className="text-sm text-gray-500 mt-0.5">AI-prioritized complaints with department routing</p>
          </div>
          <Link
            to="/add-complaint"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5 self-start"
          >
            + Submit Complaint
          </Link>
        </div>

        {/* Stats Row */}
        {!loading && !error && total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total",    value: total,    color: "text-gray-800" },
              { label: "High Priority", value: high,  color: "text-red-600"  },
              { label: "Pending",  value: pending,  color: "text-yellow-600"},
              { label: "Resolved", value: resolved, color: "text-green-600" }
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by title, description or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-1.5">
            {["All", "High", "Medium", "Low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <svg className="animate-spin h-7 w-7 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 text-center">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-10 text-center">
            <div className="text-4xl mb-3">{search || filter !== "All" ? "🔍" : "📋"}</div>
            <p className="text-gray-500 text-sm">
              {search || filter !== "All"
                ? "No complaints match your search or filter."
                : "No complaints yet. Be the first to submit one!"}
            </p>
            {!search && filter === "All" && (
              <Link
                to="/add-complaint"
                className="inline-block mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Submit Complaint
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filtered.map((item) => (
          <ComplaintCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ComplaintList;