import { useState } from "react";
import FilterSortJob from "./components/FilterSortJob";
import AddJob from "./components/AddJob";

function App() {
  const [refreshJobs, setRefreshJobs] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  const handleJobsChanged = () => setRefreshJobs((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Header */}
      <header className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-gray-900 py-14 px-4 text-center shadow-md">

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Find Your Dream Job Today!
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          Connecting Talent with Opportunity — Your Gateway to Career Success.
        </p>

        {/* 🔹 Add Job Button */}
        <button
          onClick={() => setShowAddJob(true)}
          className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-50 transition"
        >
          ➕ Add Job
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
