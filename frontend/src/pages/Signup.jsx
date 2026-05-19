import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await API.post("/auth/signup", formData);
      alert("Signup Successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden grid md:grid-cols-2">
        <div className="bg-indigo-600 text-white p-8 flex flex-col justify-center">
          <h4 className="text-xl font-semibold">Create your SmartComplaint account</h4>
          <p className="mt-2 text-indigo-100">Register quickly and start managing complaints with AI assistance and modern tracking.</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm">Secure</span>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm">Fast</span>
            <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-sm">Modern</span>
          </div>
        </div>

        <div className="p-8">
          <h3 className="mb-3 text-2xl font-semibold">Signup</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm mb-1">Name</label>
              <input className="border rounded px-3 py-2 w-full" type="text" name="name" placeholder="Your name" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Email</label>
              <input className="border rounded px-3 py-2 w-full" type="email" name="email" placeholder="Your email" onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Password</label>
              <input className="border rounded px-3 py-2 w-full" type="password" name="password" placeholder="Choose a password" onChange={handleChange} required />
            </div>
            <button className="bg-indigo-600 text-white w-full py-2 rounded" type="submit">Signup</button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/" className="text-indigo-600 font-medium">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;