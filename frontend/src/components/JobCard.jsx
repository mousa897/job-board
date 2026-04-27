import { Link } from "react-router-dom";

const typeColors = {
  "full-time": { bg: "#dcfce7", color: "#16a34a" },
  "part-time": { bg: "#fef9c3", color: "#ca8a04" },
  remote: { bg: "#dbeafe", color: "#2563eb" },
  internship: { bg: "#f3e8ff", color: "#9333ea" },
  contract: { bg: "#ffedd5", color: "#ea580c" },
};

const JobCard = ({ job }) => {
  const badge = typeColors[job.type] || { bg: "#f1f5f9", color: "#475569" };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{job.title}</h3>
          <p style={styles.company}>{job.company}</p>
        </div>
        <span
          style={{
            ...styles.badge,
            backgroundColor: badge.bg,
            color: badge.color,
          }}
        >
          {job.type}
        </span>
      </div>

      <p style={styles.location}>📍 {job.location}</p>

      <p style={styles.description}>
        {job.description.length > 120
          ? job.description.substring(0, 120) + "..."
          : job.description}
      </p>

      <div style={styles.skills}>
        {job.skills.slice(0, 4).map((skill) => (
          <span key={skill} style={styles.skill}>
            {skill}
          </span>
        ))}
      </div>

      <div style={styles.footer}>
        <span style={styles.salary}>
          {job.salary?.min && job.salary?.max
            ? `$${job.salary.min} - $${job.salary.max}`
            : "Salary not specified"}
        </span>
        <Link to={`/jobs/${job._id}`} style={styles.button}>
          View Job →
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    transition: "transform 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: "1.1rem", fontWeight: "700", color: "#1e293b" },
  company: { color: "#6366f1", fontWeight: "600", marginTop: "0.25rem" },
  badge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  location: { color: "#64748b", fontSize: "0.9rem" },
  description: { color: "#475569", fontSize: "0.9rem", lineHeight: "1.6" },
  skills: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  skill: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "0.25rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
  },
  salary: { color: "#16a34a", fontWeight: "600", fontSize: "0.95rem" },
  button: {
    backgroundColor: "#6366f1",
    color: "white",
    padding: "0.5rem 1.25rem",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
};

export default JobCard;
