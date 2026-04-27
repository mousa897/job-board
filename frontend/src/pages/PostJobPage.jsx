import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const PostJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    type: "full-time",
    salaryMin: "",
    salaryMax: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/jobs", {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
          currency: "USD",
        },
        // Convert comma separated string to array
        // "React, Node.js, MongoDB" → ["React", "Node.js", "MongoDB"]
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      toast.success("Job posted successfully! 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Post a New Job</h2>
        <p style={styles.subtitle}>Fill in the details below</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title</label>
              <input
                style={styles.input}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Company Name</label>
              <input
                style={styles.input}
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Tech Corp"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Amman, Jordan"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Job Type</label>
              <select
                style={styles.input}
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="remote">Remote</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Min Salary (USD)</label>
              <input
                style={styles.input}
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="e.g. 1000"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Max Salary (USD)</label>
              <input
                style={styles.input}
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="e.g. 2000"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Skills (comma separated)</label>
            <input
              style={styles.input}
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job Description</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the role, responsibilities, and requirements..."
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
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
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#1e293b" },
  subtitle: { color: "#64748b", marginTop: "0.25rem", marginBottom: "2rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    marginBottom: "1.25rem",
  },
  field: {
    marginBottom: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: { fontWeight: "600", color: "#374151" },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  textarea: {
    padding: "0.75rem 1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.85rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
  },
};

export default PostJobPage;
