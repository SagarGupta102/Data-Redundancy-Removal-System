import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../api";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("authUser");
  let user = {};

  try {
    user = savedUser ? JSON.parse(savedUser) : {};
  } catch {
    user = {};
  }

  function handleLogout() {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      clearAuthSession();
      navigate("/login", { replace: true });
    }
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Settings</p>
          <h1>Settings</h1>
          <p className="page-description">
            Manage your account information and session.
          </p>
        </div>
      </header>

      <section className="content-panel settings-panel">
        <div className="settings-heading">
          <div className="settings-avatar">
            {(user.name || user.fullName || user.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2>Profile Information</h2>
            <p>Your registered account details.</p>
          </div>
        </div>

        <div className="settings-details">
          <div className="settings-field">
            <label>Full Name</label>
            <p>{user.name || user.fullName || "Not available"}</p>
          </div>

          <div className="settings-field">
            <label>Email Address</label>
            <p>{user.email || "Not available"}</p>
          </div>
        </div>

        <div className="settings-logout-section">
         <button
            type="button"
            className="settings-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}

export default Settings;