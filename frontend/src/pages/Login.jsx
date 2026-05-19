import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left: Form */}
        <div className="p-8 md:p-10">
          <div className="mb-6">
            <span className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
              Welcome Back
            </span>
            <h1 className="text-2xl font-bold text-gray-800">Login to SmartComplaint</h1>
            <p className="text-sm text-gray-500 mt-1">Access your dashboard and manage complaints with AI assistance.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="email" name="email" placeholder="you@example.com"
                onChange={handleChange} required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="password" name="password" placeholder="Enter your password"
                onChange={handleChange} required
              />
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
          </p>
        </div>

        {/* Right: Hero Panel */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-8 md:p-10 flex flex-col justify-center">
          <div className="text-3xl mb-4">🛡️</div>
          <h2 className="text-xl font-bold mb-2">Secure complaint tracking</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Fast, reliable, and easy to use. Keep your support workflow flowing with smart AI-driven suggestions and real-time status updates.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Fast access", "Smart priority", "AI routing", "Clean UI"].map((tag) => (
              <span key={tag} className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;