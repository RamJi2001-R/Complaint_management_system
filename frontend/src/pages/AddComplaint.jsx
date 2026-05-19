import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const AddComplaint = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const aiRes = await API.post("/ai/analyze", {
        description: formData.description
      });

      setAiResult(aiRes.data);

      const finalData = {
        ...formData,
        aiPriority: aiRes.data.priority,
        aiDepartment: aiRes.data.department,
        aiSummary: aiRes.data.summary,
        aiResponse: aiRes.data.response
      };

      await API.post("/complaints", finalData);

      alert("Complaint Submitted");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded p-6 mb-5">
          <h3 className="mb-2 text-2xl font-semibold">Add Complaint</h3>
          <p className="text-gray-600">Submit a complaint and receive AI-powered department and priority recommendations instantly.</p>
        </div>

        <div className="bg-white shadow rounded p-6 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input className="border rounded px-3 py-2 w-full" type="text" name="name" placeholder="Name" onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="border rounded px-3 py-2 w-full" type="email" name="email" placeholder="Email" onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Title</label>
                <input className="border rounded px-3 py-2 w-full" type="text" name="title" placeholder="Title" onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Description</label>
                <textarea className="border rounded px-3 py-2 w-full" name="description" placeholder="Description" onChange={handleChange} rows={4} required />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <input className="border rounded px-3 py-2 w-full" type="text" name="category" placeholder="Category" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input className="border rounded px-3 py-2 w-full" type="text" name="location" placeholder="Location" onChange={handleChange} />
              </div>
            </div>

            <div className="mt-4 text-right">
              <button className="bg-indigo-600 text-white px-5 py-2 rounded" type="submit">Submit</button>
            </div>
          </form>
        </div>

        {aiResult && (
          <div className="bg-white shadow rounded p-4">
            <h5 className="mb-3 text-lg font-semibold">AI Analysis</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-sm text-gray-700">Priority: <span className="font-medium">{aiResult.priority}</span></div>
              <div className="text-sm text-gray-700">Department: <span className="font-medium">{aiResult.department}</span></div>
            </div>
            <div className="mt-4">
              <p className="mb-1 font-medium">Summary</p>
              <p className="text-gray-600">{aiResult.summary}</p>
              <p className="mt-3 mb-1 font-medium">Response</p>
              <p className="text-gray-600">{aiResult.response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddComplaint;