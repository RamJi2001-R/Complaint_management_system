import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-lg font-semibold">SmartComplaint</Link>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-indigo-500">Dashboard</Link>
          <Link to="/add-complaint" className="px-3 py-2 rounded hover:bg-indigo-500">Add Complaint</Link>
          <Link to="/complaints" className="px-3 py-2 rounded hover:bg-indigo-500">Complaints</Link>
          <button onClick={logout} className="ml-4 bg-white text-indigo-600 px-3 py-1 rounded">Logout</button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="p-2 rounded hover:bg-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-indigo-700">
          <div className="px-4 py-3 space-y-1">
            <Link to="/dashboard" className="block px-2 py-2 rounded hover:bg-indigo-600">Dashboard</Link>
            <Link to="/add-complaint" className="block px-2 py-2 rounded hover:bg-indigo-600">Add Complaint</Link>
            <Link to="/complaints" className="block px-2 py-2 rounded hover:bg-indigo-600">Complaints</Link>
            <button onClick={logout} className="w-full text-left px-2 py-2 rounded hover:bg-indigo-600">Logout</button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
