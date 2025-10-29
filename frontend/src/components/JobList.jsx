import { useState } from "react";
import { Pencil, MapPin, Clock } from "lucide-react";
import DeleteJob from "./DeleteJob";
import EditJob from "./EditJob";

function JobList({ jobs, onEdit, onDelete }) {
  const [jobToEdit, setJobToEdit] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  if (!jobs || jobs.length === 0)
    return <p className="text-center mt-10 text-gray-500">No jobs found.</p>;

  return (
    <>
      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto p-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="relative group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            {/* Edit/Delete Icons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setJobToEdit(job);
                }}
                className="text-yellow-500 hover:text-yellow-600 transition"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-red-500 hover:text-red-600 transition"
              >
                <DeleteJob
                  jobId={job.id}
                  onDelete={() => onDelete(job.id)}
                  iconOnly
                />
              </button>
            </div>

            {/* Job Info */}
            <div className="flex flex-col flex-grow">
              <h2
                className="text-lg font-semibold text-gray-800 mb-1 leading-snug line-clamp-2 pr-8"
                title={job.title}
              >
                {job.title}
              </h2>
              <p className="text-gray-600 font-medium mb-2">{job.company}</p>

              <div className="text-gray-500 text-sm mb-3 flex items-center flex-wrap gap-2">
                <MapPin size={14} className="text-rose-500" />
                <span>{job.location}</span>
                {job.job_type && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-700 font-medium">
                      {job.job_type}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
                <Clock size={14} />
                {job.posting_date
                  ? new Date(job.posting_date).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* Tags */}
              {job.tags && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {job.tags
                    .split(",")
                    .slice(0, 4)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full border border-yellow-200"
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

      {/* Edit Modal */}
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

      {/* Job Details Popup */}
      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setSelectedJob(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 animate-fadeIn"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 mb-4">{selectedJob.company}</p>

            <div className="flex items-center gap-2 text-gray-500 mb-3">
              <MapPin size={16} />
              <span>{selectedJob.location}</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-700 font-medium">
                {selectedJob.job_type}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              🕒 Posted:{" "}
              {selectedJob.posting_date
                ? new Date(selectedJob.posting_date).toLocaleDateString()
                : "N/A"}
            </p>

            {selectedJob.description && (
              <p className="text-gray-700 mb-4">{selectedJob.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedJob.tags &&
                selectedJob.tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="bg-yellow-50 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full border border-yellow-200"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobList;
