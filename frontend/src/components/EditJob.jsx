import React, { useState, useEffect } from "react";

function EditJob({ job, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        job_type: job.job_type || "",
        tags: job.tags || "",
      });
    }
  }, [job]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://127.0.0.1:5000/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage("Job updated successfully!");
      setTimeout(() => {
        if (onUpdated) onUpdated(); // refresh list after showing message
        onClose(); // close modal after success message shows
      }, 1200);
    } catch (err) {
      setMessage(`→ ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative transition-all duration-300">
        {/* × Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition text-lg"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Edit Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Job Title"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] outline-none"
          />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Company"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] outline-none"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Location"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] outline-none"
          />

          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] outline-none bg-white"
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffcc00] text-gray-900 font-semibold py-3 rounded-xl hover:bg-[#f5c000] transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>

          {message && (
            <p
              className={`text-sm text-center mt-2 ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditJob;
