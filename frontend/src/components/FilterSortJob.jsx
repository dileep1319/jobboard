import { useEffect, useState, useCallback } from "react";
import JobList from "./JobList";
import { ChevronDown } from "lucide-react";

function FilterSortJob({ onEdit }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filtersChanged, setFiltersChanged] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const sortParam =
        sortOrder === "oldest" ? "posting_date_asc" : "posting_date_desc";
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

  // ✅ Filtering logic
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

  // ✅ Pagination renderer
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
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            page === i
              ? "bg-gray-900 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setFiltersChanged(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setJobType("All");
    setLocation("All");
    setSortOrder("newest");
    setFiltersChanged(false);
    fetchJobs();
  };

  // ✅ Simplified dropdown (no yellow)
  const dropdownClass = () =>
    `appearance-none relative rounded-full px-4 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] transition-all duration-200 pr-8 bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300`;

  return (
    <section className="max-w-6xl mx-auto -mt-8 relative z-10">
      {/* ✅ Filter Bar */}
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-wrap gap-4 justify-center items-center mb-12 mx-4 -mt-10 border border-gray-100">
        <input
          type="text"
          placeholder="Search job or company"
          value={searchTerm}
          onChange={handleFilterChange(setSearchTerm)}
          className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] placeholder-gray-400"
        />

        <input
          type="text"
          placeholder="Location"
          value={location === "All" ? "" : location}
          onChange={(e) => {
            setLocation(e.target.value.trim() === "" ? "All" : e.target.value);
            setFiltersChanged(true);
          }}
          className="rounded-full px-4 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] transition-all duration-200 bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300"
        />

        {/* Job Type Dropdown */}
        <div className="relative w-44">
          <select
            value={jobType}
            onChange={handleFilterChange(setJobType)}
            className={dropdownClass()}
          >
            <option value="All">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-44">
          <select
            value={sortOrder}
            onChange={handleFilterChange(setSortOrder)}
            className={dropdownClass()}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
          />
        </div>

        {/* Search / Reset Button */}
        {filtersChanged ? (
          <button
            onClick={resetFilters}
            className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Reset Filters
          </button>
        ) : (
          <button
            onClick={() => {
              setPage(1);
              fetchJobs();
            }}
            className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Search Jobs
          </button>
        )}
      </div>

      {/* ✅ Job Results */}
      {loading ? (
        <p className="text-center mt-10 text-gray-500 animate-pulse">
          Loading jobs...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 mt-10">{error}</p>
      ) : (
        <>
          <JobList
            jobs={filteredJobs}
            onEdit={handleJobUpdated}
            onDelete={handleJobUpdated}
          />

          {/* ✅ Pagination */}
          <div className="flex justify-center items-center flex-wrap gap-3 mt-12 mb-16">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-full hover:bg-gray-200 disabled:opacity-50 transition"
            >
              Prev
            </button>

            {renderPageNumbers()}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition"
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
