import { useEffect, useState, useCallback } from "react";
import JobList from "./JobList";

function FilterSortJob({ onEdit }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch jobs with pagination
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      let sortParam;
      switch (sortOrder) {
        case "oldest":
          sortParam = "posting_date_asc";
          break;
        case "az":
          sortParam = "title_asc";
          break;
        case "za":
          sortParam = "title_desc";
          break;
        default:
          sortParam = "posting_date_desc";
      }

      const res = await fetch(
        `http://127.0.0.1:5000/jobs?page=${page}&limit=${limit}&sort=${sortParam}&ts=${Date.now()}`
      );
      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data.jobs);
      setFilteredJobs(data.jobs);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortOrder]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ✅ Client-side filtering
  useEffect(() => {
    let result = [...jobs];
    const term = searchTerm.toLowerCase();

    if (term) {
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(term) ||
          job.company?.toLowerCase().includes(term)
      );
    }

    if (jobType !== "All") {
      result = result.filter(
        (job) => job.job_type?.toLowerCase() === jobType.toLowerCase()
      );
    }

    if (location !== "All") {
      result = result.filter(
        (job) => job.location?.toLowerCase() === location.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [searchTerm, jobType, location, jobs]);

  const handleJobUpdated = () => fetchJobs();

  // ✅ Helper: render page numbers dynamically
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
            page === i
              ? "bg-yellow-500 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <section className="max-w-6xl mx-auto -mt-8 relative z-10">
      {/* 🔹 Filter/Search Bar */}
      <div className="bg-white shadow-md rounded-xl p-5 flex flex-wrap gap-4 justify-center items-center mb-10 mx-4 -mt-10">
        <input
          type="text"
          placeholder="🔍 Job title or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="text"
          placeholder="📍 Location"
          value={location === "All" ? "" : location}
          onChange={(e) =>
            setLocation(e.target.value.trim() === "" ? "All" : e.target.value)
          }
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="All">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            fetchJobs();
          }}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
        >
          Search Job
        </button>
      </div>

      {/* 🔹 Job Results */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500 animate-pulse">
          ⏳ Loading jobs...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">❌ {error}</p>
      ) : (
        <>
          <JobList
            jobs={filteredJobs}
            onEdit={handleJobUpdated}
            onDelete={handleJobUpdated}
          />

          {/* 🔹 Pagination Controls (modern, centered) */}
          <div className="flex justify-center items-center flex-wrap gap-3 mt-12 mb-16">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            {renderPageNumbers()}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default FilterSortJob;
