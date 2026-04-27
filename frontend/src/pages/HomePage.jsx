import { useState, useEffect } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import toast from "react-hot-toast";

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (search) params.search = search;
        if (type) params.type = type;
        if (location) params.location = location;

        const { data } = await api.get("/jobs", { params });
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error("Failed to fetch jobs");
        error;
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, search, type, location]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setType("");
    setLocation("");
    setPage(1);
  };

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Find Your Dream Job</h1>
        <p style={styles.heroSubtitle}>
          Browse hundreds of opportunities from top companies
        </p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} style={styles.filters}>
        <input
          style={styles.filterInput}
          type="text"
          placeholder="Search jobs, skills, companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={styles.filterInput}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="remote">Remote</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
        </select>
        <input
          style={styles.filterInput}
          type="text"
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button style={styles.searchButton} type="submit">
          Search
        </button>
        <button style={styles.resetButton} type="button" onClick={handleReset}>
          Reset
        </button>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <p style={styles.message}>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p style={styles.message}>No jobs found.</p>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageButton}
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span style={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            style={styles.pageButton}
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  hero: { textAlign: "center", padding: "3rem 0 2rem" },
  heroTitle: { fontSize: "2.5rem", fontWeight: "800", color: "#1e293b" },
  heroSubtitle: { color: "#64748b", fontSize: "1.1rem", marginTop: "0.75rem" },
  filters: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  filterInput: {
    flex: 1,
    minWidth: "150px",
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    backgroundColor: "white",
  },
  searchButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  resetButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "1.5rem",
  },
  message: {
    textAlign: "center",
    color: "#64748b",
    padding: "3rem",
    fontSize: "1.1rem",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
  },
  pageButton: {
    padding: "0.6rem 1.25rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  pageInfo: { color: "#475569", fontWeight: "600" },
};

export default HomePage;
