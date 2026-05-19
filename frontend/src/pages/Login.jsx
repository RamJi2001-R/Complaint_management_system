import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden grid md:grid-cols-2">
        <div className="p-8">
          <div className="mb-4">
            <span className="inline-block bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-sm">Welcome</span>
            <h3 className="mt-3 text-2xl font-semibold">Login to SmartComplaint</h3>
            <p className="text-gray-600">Access your dashboard, submit complaints, and manage statuses with ease.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input className="border rounded px-3 py-2 w-full" type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Password</label>
              <input className="border rounded px-3 py-2 w-full" type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
            </div>
            <button className="bg-indigo-600 text-white w-full py-2 rounded">Login</button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-indigo-600 font-medium">Signup</Link>
          </div>
        </div>

        <div className="bg-indigo-600 text-white p-8 flex flex-col justify-center">
          <h4 className="text-xl font-semibold">Secure complaint tracking</h4>
          <p className="mt-2 text-indigo-100">Fast, reliable, and easy to use. Keep your support workflow flowing with smart AI-driven suggestions.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm">Fast access</span>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm">Smart priority</span>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm">Clean UI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;