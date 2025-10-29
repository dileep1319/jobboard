import React, { useState, useEffect } from "react";

function AddEditJob({ onSuccess, jobToEdit }) {
  const isEditing = !!jobToEdit;

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Pre-fill form when editing
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || "",
        company: jobToEdit.company || "",
        location: jobToEdit.location || "",
        job_type: jobToEdit.job_type || "",
        tags: jobToEdit.tags || "",
      });
    }
  }, [jobToEdit]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = isEditing
        ? `http://127.0.0.1:5000/jobs/${jobToEdit.id}`
        : "http://127.0.0.1:5000/jobs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage(
        isEditing
          ? "✅ Job updated successfully!"
          : "✅ Job added successfully!"
      );

      // Reset form if new job added
      if (!isEditing) {
        setFormData({
          title: "",
          company: "",
          location: "",
          job_type: "",
          tags: "",
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 mb-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {isEditing ? "✏️ Edit Job" : "➕ Add New Job"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter job title"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter company name"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter location"
          />
        </div>

        {/* ✅ Job Type (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white"
          >
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="e.g. React, Node.js, Remote"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Job" : "Add Job"}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.startsWith("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddEditJob;
