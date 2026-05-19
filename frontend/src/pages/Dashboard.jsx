import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Dashboard = () => {

  const navigate = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/complaints");
        const data = res.data;
        setStats({
          total:    data.length,
          pending:  data.filter(c => c.status === "Pending").length,
          progress: data.filter(c => c.status === "In Progress").length,
          resolved: data.filter(c => c.status === "Resolved").length,
          high:     data.filter(c => c.aiPriority === "High").length,
          medium:   data.filter(c => c.aiPriority === "Medium").length,
          low:      data.filter(c => c.aiPriority === "Low").length,
          recent:   data.slice(-3).reverse()
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-7 mb-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute right-12 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <h1 className="text-2xl font-bold mb-1">Smart Complaint Dashboard</h1>
            <p className="text-indigo-100 text-sm">AI-powered management with real-time analytics and smart routing.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                to="/add-complaint"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                + Submit Complaint
              </Link>
              <Link
                to="/complaints"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View All Complaints
              </Link>
              <button
                onClick={logout}
                className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-7 w-7 text-indigo-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        ) : stats ? (
          <>
            {/* Status Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Complaints",  value: stats.total,    icon: "📋", color: "text-gray-800",   bg: "bg-white" },
                { label: "Pending",           value: stats.pending,  icon: "⏳", color: "text-yellow-600", bg: "bg-yellow-50" },
                { label: "In Progress",       value: stats.progress, icon: "🔄", color: "text-blue-600",   bg: "bg-blue-50" },
                { label: "Resolved",          value: stats.resolved, icon: "✅", color: "text-green-600",  bg: "bg-green-50" }
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} className={`${bg} border border-gray-100 rounded-xl p-5 shadow-sm`}>
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Priority Breakdown */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">AI Priority Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: "High",   value: stats.high,   color: "bg-red-500",    text: "text-red-600" },
                  { label: "Medium", value: stats.medium, color: "bg-yellow-400", text: "text-yellow-600" },
                  { label: "Low",    value: stats.low,    color: "bg-green-400",  text: "text-green-600" }
                ].map(({ label, value, color, text }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className={`text-xs font-medium w-14 ${text}`}>{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full transition-all`}
                        style={{ width: stats.total ? `${(value / stats.total) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Complaints */}
            {stats.recent?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">Recent Complaints</h2>
                  <Link to="/complaints" className="text-xs text-indigo-600 hover:underline">View all →</Link>
                </div>
                <div className="space-y-3">
                  {stats.recent.map((c) => (
                    <div key={c._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{c.title}</p>
                        <p className="text-xs text-gray-400">{c.aiDepartment || "General"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.aiPriority === "High" ? "bg-red-100 text-red-600"
                          : c.aiPriority === "Medium" ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                        }`}>{c.aiPriority}</span>
                        <span className="text-xs text-gray-400">{c.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-500 text-sm">
            No data available. <Link to="/add-complaint" className="text-indigo-600 hover:underline">Submit your first complaint</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;