import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-semibold mb-2">Smart Complaint Dashboard</h2>
          <p className="text-gray-600">Manage complaints, review AI suggestions, and update statuses.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/add-complaint" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Complaint</Link>
            <Link to="/complaints" className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded">View Complaints</Link>
            <button className="ml-2 bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;