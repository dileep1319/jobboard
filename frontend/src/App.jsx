import { useState } from "react";
import FilterSortJob from "./components/FilterSortJob";
import AddJob from "./components/AddJob";

function App() {
  const [refreshJobs, setRefreshJobs] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  const handleJobsChanged = () => setRefreshJobs((prev) => !prev);

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-gray-900">
      {/* 🔹 Header */}
      <header className="bg-[#f9d342] text-gray-900 py-14 px-4 text-center shadow-md">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
          Create Jobs  — Create Opportunities
        </h1>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Connecting Talent with Opportunity — Your Gateway to Career Success.
        </p>

        {/* 🔹 Add Job Button */}
        <button
          onClick={() => setShowAddJob(true)}
          className="bg-gray-900 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-800 transition-all duration-200"
        >
          Add Job
        </button>
      </header>

      {/* 🔹 Popup Add Job Form */}
      {showAddJob && (
        <AddJob
          onClose={() => setShowAddJob(false)}
          onSuccess={() => {
            handleJobsChanged();
            setShowAddJob(false);
          }}
        />
      )}

      {/* 🔹 Job Filter + List */}
      <FilterSortJob key={refreshJobs} onEdit={handleJobsChanged} />
    </div>
  );
}

export default App;
