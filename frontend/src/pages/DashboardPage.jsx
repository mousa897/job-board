import { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import EmployerDashboard from "../components/EmployerDashboard";

const statusColors = {
  pending: { bg: "#fef9c3", color: "#ca8a04" },
  reviewed: { bg: "#dbeafe", color: "#2563eb" },
  accepted: { bg: "#dcfce7", color: "#16a34a" },
  rejected: { bg: "#fee2e2", color: "#dc2626" },
};

const DashboardPage = () => {
  const { user } = useAuthStore();

  if (user?.role === "employer") {
    return <EmployerDashboard />;
  }

  return <SeekerDashboard />;
};

const SeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/applications/myapplications");
        setApplications(data);
      } catch (error) {
        toast.error("Failed to fetch applications");
        error;
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p style={styles.message}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Applications</h2>
      <p style={styles.subtitle}>
        You have applied to {applications.length} job
        {applications.length !== 1 ? "s" : ""}
      </p>

      {applications.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't applied to any jobs yet.</p>
          <a href="/" style={styles.link}>
            Browse Jobs →
          </a>
        </div>
      ) : (
        <div style={styles.list}>
          {applications.map((app) => {
            const badge = statusColors[app.status];
            return (
              <div key={app._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.jobTitle}>{app.job?.title}</h3>
                    <p style={styles.company}>{app.job?.company}</p>
                    <p style={styles.meta}>
                      📍 {app.job?.location} &nbsp;|&nbsp; {app.job?.type}
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
                    <p style={styles.coverLetterLabel}>Your Cover Letter:</p>
                    <p style={styles.coverLetterText}>{app.coverLetter}</p>
                  </div>
                )}

                <p style={styles.date}>
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" },
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#1e293b" },
  subtitle: { color: "#64748b", marginTop: "0.25rem", marginBottom: "2rem" },
  message: { textAlign: "center", padding: "3rem", color: "#64748b" },
  empty: { textAlign: "center", padding: "3rem", color: "#64748b" },
  link: {
    color: "#6366f1",
    fontWeight: "600",
    display: "block",
    marginTop: "1rem",
  },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitle: { fontSize: "1.1rem", fontWeight: "700", color: "#1e293b" },
  company: { color: "#6366f1", fontWeight: "600", marginTop: "0.25rem" },
  meta: { color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" },
  badge: {
    padding: "0.35rem 0.85rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  coverLetter: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    borderLeft: "3px solid #6366f1",
  },
  coverLetterLabel: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
  },
  coverLetterText: {
    color: "#475569",
    fontSize: "0.875rem",
    lineHeight: "1.6",
  },
  date: { color: "#94a3b8", fontSize: "0.8rem", marginTop: "1rem" },
};

export default DashboardPage;
