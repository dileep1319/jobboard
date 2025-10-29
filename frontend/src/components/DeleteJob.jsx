function DeleteJob({ jobId, onDelete }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("🗑️ Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete job");

      alert("✅ Job deleted successfully!");
      if (onDelete) onDelete(); // 🔹 notify parent to refresh jobs
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
    >
      🗑 Delete
    </button>
  );
}

export default DeleteJob;
