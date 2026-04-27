import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        toast.error("Job not found");
        error;
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      toast.error("Please upload your CV");
      return;
    }

    setApplying(true);
    try {
      // FormData is used when sending files — regular JSON can't handle files
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("coverLetter", coverLetter);

      await api.post(`/applications/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully! 🎉");
      setApplied(true);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p style={styles.message}>Loading...</p>;
  if (!job) return <p style={styles.message}>Job not found</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{job.title}</h1>
            <p style={styles.company}>{job.company}</p>
          </div>
          <span style={styles.badge}>{job.type}</span>
        </div>

        {/* Meta info */}
        <div style={styles.meta}>
          <span>📍 {job.location}</span>
          <span>👥 {job.applicationsCount} applicants</span>
          {job.salary?.min && (
            <span>
              💰 ${job.salary.min} - ${job.salary.max} {job.salary.currency}
            </span>
          )}
          <span>📅 Posted by {job.employer?.name}</span>
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Required Skills</h3>
          <div style={styles.skills}>
            {job.skills.map((skill) => (
              <span key={skill} style={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Job Description</h3>
          <p style={styles.description}>{job.description}</p>
        </div>

        {/* Apply Section */}
        {user?.role === "seeker" && job.status === "open" && (
          <div style={styles.applySection}>
            {applied ? (
              <p style={styles.appliedText}>✅ You have applied to this job</p>
            ) : !showForm ? (
              <button
                style={styles.applyButton}
                onClick={() => setShowForm(true)}
              >
                Apply Now
              </button>
            ) : (
              <form onSubmit={handleApply} style={styles.form}>
                <h3 style={styles.sectionTitle}>Submit Your Application</h3>

                <div style={styles.field}>
                  <label style={styles.label}>Cover Letter (optional)</label>
                  <textarea
                    style={styles.textarea}
                    rows={5}
                    placeholder="Tell the employer why you're a great fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>
                    Upload CV (PDF only, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files[0])}
                    required
                  />
                </div>

                <div style={styles.formButtons}>
                  <button
                    style={styles.applyButton}
                    type="submit"
                    disabled={applying}
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </button>
                  <button
                    style={styles.cancelButton}
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!user && (
          <p style={styles.loginPrompt}>
            <a href="/login" style={styles.loginLink}>
              Login
            </a>{" "}
            to apply for this job
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1rem",
  },
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#1e293b" },
  company: {
    color: "#6366f1",
    fontWeight: "600",
    fontSize: "1.1rem",
    marginTop: "0.25rem",
  },
  badge: {
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    padding: "0.4rem 1rem",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    color: "#64748b",
    fontSize: "0.95rem",
    padding: "1rem 0",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
    marginBottom: "1.5rem",
  },
  section: { marginBottom: "1.5rem" },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.75rem",
  },
  skills: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  skill: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "0.35rem 0.85rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  description: { color: "#475569", lineHeight: "1.8", whiteSpace: "pre-wrap" },
  applySection: {
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #e2e8f0",
  },
  applyButton: {
    padding: "0.85rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
  },
  cancelButton: {
    padding: "0.85rem 2rem",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  formButtons: { display: "flex", gap: "1rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: { fontWeight: "600", color: "#374151" },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
  },
  appliedText: { color: "#16a34a", fontWeight: "600", fontSize: "1rem" },
  loginPrompt: { marginTop: "2rem", textAlign: "center", color: "#64748b" },
  loginLink: { color: "#6366f1", fontWeight: "600" },
  message: { textAlign: "center", padding: "3rem", color: "#64748b" },
};

export default JobDetailsPage;
