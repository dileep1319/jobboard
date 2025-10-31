import { useState } from "react";
import { MapPin, Clock, X } from "lucide-react";
import DeleteJob from "./DeleteJob";
import EditJob from "./EditJob";

function JobList({ jobs, onEdit, onDelete }) {
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  if (!jobs || jobs.length === 0)
    return <p className="text-center mt-10 text-gray-500">No jobs found.</p>;

  return (
    <>
      {/* ✅ Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto p-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            <div className="flex flex-col flex-grow">
              <h2
                className="text-lg font-semibold text-gray-900 mb-1 leading-snug line-clamp-2 pr-8"
                title={job.title}
              >
                {job.title}
              </h2>
              <p className="text-gray-600 font-medium mb-2">{job.company}</p>

              <div className="text-gray-500 text-sm mb-3 flex items-center flex-wrap gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span>{job.location}</span>
                {job.job_type && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-800 font-medium">
                      {job.job_type}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                <Clock size={14} className="text-gray-400" />
                {job.posting_date
                  ? new Date(job.posting_date).toLocaleDateString()
                  : "N/A"}
              </p>

              {job.tags && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {job.tags
                    .split(",")
                    .slice(0, 4)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full border border-gray-200"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Edit Modal */}
      {jobToEdit && (
        <EditJob
          job={jobToEdit}
          onClose={() => setJobToEdit(null)}
          onUpdated={() => {
            if (onEdit) onEdit();
            setJobToEdit(null);
          }}
        />
      )}

      {/* ✅ Job Details Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fadeIn border border-gray-100 relative"
          >
            {/* 🔹 Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              title="Close"
            >
              <X size={20} />
            </button>

            {/* Job Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-snug">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 mb-4 text-sm">{selectedJob.company}</p>

            <div className="flex items-center gap-2 text-gray-500 mb-3">
              <MapPin size={16} className="text-gray-400" />
              <span>{selectedJob.location}</span>
              {selectedJob.job_type && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-800 font-medium">
                    {selectedJob.job_type}
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              Posted:{" "}
              {selectedJob.posting_date
                ? new Date(selectedJob.posting_date).toLocaleDateString()
                : "N/A"}
            </p>

            {selectedJob.description && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {selectedJob.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedJob.tags &&
                selectedJob.tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full border border-gray-200"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>

            {/* ✅ Action Buttons */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setJobToEdit(selectedJob);
                  setSelectedJob(null);
                }}
                className="px-5 py-2 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition"
              >
                Edit
              </button>

              {/* ✅ Delete using component */}
              <DeleteJob
                jobId={selectedJob.id}
                onDelete={() => {
                  if (onDelete) onDelete(selectedJob.id);
                  setSelectedJob(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobList;
