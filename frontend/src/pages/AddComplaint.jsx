import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const PRIORITY_COLOR = {
  High:   "text-red-600 bg-red-50 border-red-200",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
  Low:    "text-green-600 bg-green-50 border-green-200"
};

const SENTIMENT_COLOR = {
  Urgent:   "text-red-600",
  Negative: "text-orange-500",
  Neutral:  "text-gray-500",
  Positive: "text-green-600"
};

const AddComplaint = () => {

  const [formData, setFormData] = useState({
    name: "", email: "", title: "",
    description: "", category: "", location: ""
  });

  const [aiResult,   setAiResult]   = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);
    setError("");

    try {
      // Send full context to AI for better analysis
      const aiRes = await API.post("/ai/analyze", {
        title:       formData.title,
        description: formData.description,
        category:    formData.category,
        location:    formData.location
      });

      const ai = aiRes.data;
      setAiResult(ai);

      const finalData = {
        ...formData,
        aiPriority:     ai.priority,
        aiDepartment:   ai.department,
        aiSummary:      ai.summary,
        aiResponse:     ai.response,
        aiSentiment:    ai.sentiment,
        aiUrgencyScore: ai.urgencyScore
      };

      await API.post("/complaints", finalData);
      setSubmitted(true);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", title: "", description: "", category: "", location: "" });
    setAiResult(null);
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Submit a Complaint</h1>
          <p className="text-gray-500 text-sm">
            Describe your issue and our AI will instantly classify it, assign a priority, and route it to the right department.
          </p>
        </div>

        {/* Success State */}
        {submitted ? (
          <>
            {/* Success Banner */}
            <div className="bg-white shadow-sm border border-green-100 rounded-xl p-6 mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-5xl shrink-0">✅</div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Complaint Registered Successfully!</h2>
                <p className="text-gray-500 text-sm">
                  Routed to <strong className="text-indigo-600">{aiResult?.department}</strong>. Below is your full AI analysis report.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                + New Complaint
              </button>
            </div>

            {/* AI Analysis Result — shown after submit */}
            {aiResult && (
              <div className="bg-white shadow-sm border border-indigo-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-semibold text-gray-800">AI Analysis Report</h2>
                  <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                    Powered by LLaMA 4 (OpenRouter)
                  </span>
                </div>

                {/* Priority + Department + Sentiment + Urgency */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className={`border rounded-lg p-3 ${PRIORITY_COLOR[aiResult.priority] || "bg-gray-50 border-gray-200"}`}>
                    <p className="text-xs text-gray-500 mb-0.5">Priority</p>
                    <p className="font-semibold text-sm">{aiResult.priority}</p>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Department</p>
                    <p className="font-semibold text-sm text-gray-800">{aiResult.department}</p>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Sentiment</p>
                    <p className={`font-semibold text-sm ${SENTIMENT_COLOR[aiResult.sentiment] || "text-gray-600"}`}>
                      {aiResult.sentiment || "Neutral"}
                    </p>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Urgency Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            (aiResult.urgencyScore || 5) >= 8 ? "bg-red-500"
                            : (aiResult.urgencyScore || 5) >= 5 ? "bg-yellow-400"
                            : "bg-green-400"
                          }`}
                          style={{ width: `${((aiResult.urgencyScore || 5) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{aiResult.urgencyScore || 5}/10</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Summary</p>
                  <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3">{aiResult.summary}</p>
                </div>

                {/* AI Response */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Response</p>
                  <p className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg p-3 leading-relaxed">{aiResult.response}</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Form */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-6 mb-5">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      type="text" name="name" placeholder="Your full name"
                      value={formData.name} onChange={handleChange} required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      type="email" name="email" placeholder="you@example.com"
                      value={formData.email} onChange={handleChange} required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      type="text" name="title" placeholder="Brief title of your complaint"
                      value={formData.title} onChange={handleChange} required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                      name="description" placeholder="Describe the issue in detail..."
                      value={formData.description} onChange={handleChange}
                      rows={5} required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                      name="category" value={formData.category} onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Water">Water</option>
                      <option value="Garbage / Sanitation">Garbage / Sanitation</option>
                      <option value="Roads & Transport">Roads & Transport</option>
                      <option value="Noise / Environment">Noise / Environment</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Public Safety">Public Safety</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      type="text" name="location" placeholder="Street, area or landmark"
                      value={formData.location} onChange={handleChange}
                    />
                  </div>
                </div>

                {error && (
                  <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    ⚠️ {error}
                  </p>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Analyzing with AI...
                      </>
                    ) : "Submit Complaint"}
                  </button>
                </div>
              </form>
            </div>

            {/* AI Result Panel */}
            {aiResult && (
              <div className="bg-white shadow-sm border border-indigo-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xl">🤖</span>
                  <h2 className="text-lg font-semibold text-gray-800">AI Analysis Result</h2>
                  <span className="ml-auto text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                    Powered by LLaMA 4 (OpenRouter)
                  </span>
                </div>

                {/* Priority + Department + Sentiment + Urgency */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className={`border rounded-lg p-3 ${PRIORITY_COLOR[aiResult.priority] || "bg-gray-50 border-gray-200"}`}>
                    <p className="text-xs text-gray-500 mb-0.5">Priority</p>
                    <p className="font-semibold text-sm">{aiResult.priority}</p>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Department</p>
                    <p className="font-semibold text-sm text-gray-800">{aiResult.department}</p>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Sentiment</p>
                    <p className={`font-semibold text-sm ${SENTIMENT_COLOR[aiResult.sentiment] || "text-gray-600"}`}>
                      {aiResult.sentiment || "Neutral"}
                    </p>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Urgency Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            (aiResult.urgencyScore || 5) >= 8 ? "bg-red-500"
                            : (aiResult.urgencyScore || 5) >= 5 ? "bg-yellow-400"
                            : "bg-green-400"
                          }`}
                          style={{ width: `${((aiResult.urgencyScore || 5) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">{aiResult.urgencyScore || 5}/10</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Summary</p>
                  <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3">{aiResult.summary}</p>
                </div>

                {/* AI Response */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">AI Response</p>
                  <p className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg p-3 leading-relaxed">{aiResult.response}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddComplaint;