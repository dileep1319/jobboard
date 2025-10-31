import { useState } from "react";
import { X, Loader2 } from "lucide-react";

function DeleteJob({ jobId, onDelete }) {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setFeedback(null); // reset previous messages
    try {
      const res = await fetch(`http://127.0.0.1:5000/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete job");

      // stop loading before showing success
      setLoading(false);
      setFeedback("✅ Job deleted successfully!");

      // close popup after short delay
      setTimeout(() => {
        setShowPopup(false);
        setFeedback(null);
        if (onDelete) onDelete(); // refresh job list
      }, 1000);
    } catch (err) {
      setLoading(false);
      setFeedback("❌ " + err.message);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all shadow-sm active:scale-95"
      >
        Delete
      </button>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm text-center relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPopup(false)}
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Job
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>

            {/* Feedback Message */}
            {feedback && (
              <p className="text-sm font-medium text-gray-700 mb-4">{feedback}</p>
            )}

            <div className="flex justify-center gap-3">
              {!feedback && (
                <>
                  <button
                    onClick={() => setShowPopup(false)}
                    disabled={loading}
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`px-5 py-2 rounded-full text-white text-sm font-medium transition-all flex items-center justify-center ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteJob;
