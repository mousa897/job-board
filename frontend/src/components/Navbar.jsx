import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        JobBoard
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Jobs
        </Link>

        {user ? (
          <>
            {user.role === "employer" && (
              <Link to="/post-job" style={styles.link}>
                Post a Job
              </Link>
            )}
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>
            <span style={styles.name}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.linkButton}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#6366f1",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  link: { color: "#475569", fontWeight: "500" },
  name: { color: "#6366f1", fontWeight: "600" },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  linkButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#6366f1",
    color: "white",
    borderRadius: "6px",
    fontWeight: "600",
  },
};

export default Navbar;
