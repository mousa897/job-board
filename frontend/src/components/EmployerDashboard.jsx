import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const statusColors = {
  pending: { bg: "#fef9c3", color: "#ca8a04" },
  reviewed: { bg: "#dbeafe", color: "#2563eb" },
  accepted: { bg: "#dcfce7", color: "#16a34a" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const { data } = await api.get("/jobs/myjobs");
        setJobs(data);
      } catch (error) {
        toast.error("Failed to fetch your jobs");
        error;
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    setLoadingApps(true);
    try {
      const { data } = await api.get(`/applications/job/${job._id}`);
      setApplications(data);
    } catch (error) {
      toast.error("Failed to fetch applications");
      error;
    } finally {
      setLoadingApps(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update status");
      error;
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      if (selectedJob?._id === jobId) {
        setSelectedJob(null);
        setApplications([]);
      }
      toast.success("Job deleted");
    } catch (error) {
      toast.error("Failed to delete job");
      error;
    }
  };

  if (loading) return <p style={styles.message}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Employer Dashboard</h2>
      <p style={styles.subtitle}>Manage your job postings and applicants</p>

      <div style={styles.layout}>
        {/* Left — Job List */}
        <div style={styles.jobList}>
          <h3 style={styles.panelTitle}>Your Jobs ({jobs.length})</h3>
          {jobs.length === 0 ? (
            <p style={styles.empty}>No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                style={{
                  ...styles.jobItem,
                  borderColor:
                    selectedJob?._id === job._id ? "#6366f1" : "#e2e8f0",
                  backgroundColor:
                    selectedJob?._id === job._id ? "#f5f3ff" : "white",
                }}
                onClick={() => handleSelectJob(job)}
              >
                <div style={styles.jobItemHeader}>
                  <h4 style={styles.jobItemTitle}>{job.title}</h4>
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering the job select
                      handleDeleteJob(job._id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
                <p style={styles.jobItemMeta}>
                  {job.company} · {job.location}
                </p>
                <p style={styles.jobItemApps}>
                  {job.applicationsCount} applicant
                  {job.applicationsCount !== 1 ? "s" : ""}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right — Applicants */}
        <div style={styles.applicantPanel}>
          {!selectedJob ? (
            <div style={styles.selectPrompt}>
              <p>👈 Select a job to view applicants</p>
            </div>
          ) : loadingApps ? (
            <p style={styles.message}>Loading applicants...</p>
          ) : (
            <>
              <h3 style={styles.panelTitle}>
                Applicants for "{selectedJob.title}" ({applications.length})
              </h3>

              {applications.length === 0 ? (
                <p style={styles.empty}>No applications yet.</p>
              ) : (
                applications.map((app) => {
                  const badge = statusColors[app.status];
                  return (
                    <div key={app._id} style={styles.appCard}>
                      <div style={styles.appHeader}>
                        <div>
                          <h4 style={styles.applicantName}>
                            {app.applicant?.name}
                          </h4>
                          <p style={styles.applicantEmail}>
                            {app.applicant?.email}
                          </p>
                        </div>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {app.status}
                        </span>
                      </div>

                      {app.coverLetter && (
                        <div style={styles.coverLetter}>
                          <p style={styles.coverLetterLabel}>Cover Letter:</p>
                          <p style={styles.coverLetterText}>
                            {app.coverLetter}
                          </p>
                        </div>
                      )}

                      <div style={styles.appFooter}>
                        <a
                          href={`http://localhost:5000/${app.cvPath.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.cvLink}
                        >
                          📄 View CV
                        </a>

                        <select
                          style={styles.statusSelect}
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" },
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#1e293b" },
  subtitle: { color: "#64748b", marginTop: "0.25rem", marginBottom: "2rem" },
  layout: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "1.5rem",
    alignItems: "start",
  },
  panelTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1rem",
  },
  jobList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  jobItem: {
    backgroundColor: "white",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    padding: "1rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  jobItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobItemTitle: { fontWeight: "700", color: "#1e293b", fontSize: "0.95rem" },
  jobItemMeta: { color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" },
  jobItemApps: {
    color: "#6366f1",
    fontSize: "0.8rem",
    fontWeight: "600",
    marginTop: "0.25rem",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0.25rem",
  },
  applicantPanel: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    minHeight: "400px",
  },
  selectPrompt: {
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "1rem",
  },
  appCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "1.25rem",
    marginBottom: "1rem",
  },
  appHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  applicantName: { fontWeight: "700", color: "#1e293b" },
  applicantEmail: {
    color: "#64748b",
    fontSize: "0.875rem",
    marginTop: "0.15rem",
  },
  badge: {
    padding: "0.35rem 0.85rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  coverLetter: {
    margin: "1rem 0",
    padding: "0.75rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    borderLeft: "3px solid #6366f1",
  },
  coverLetterLabel: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.4rem",
    fontSize: "0.8rem",
  },
  coverLetterText: { color: "#475569", fontSize: "0.85rem", lineHeight: "1.6" },
  appFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
  },
  cvLink: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: "0.875rem",
    textDecoration: "none",
  },
  statusSelect: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.875rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  message: { textAlign: "center", padding: "2rem", color: "#64748b" },
  empty: { color: "#94a3b8", textAlign: "center", padding: "2rem" },
};

export default EmployerDashboard;
