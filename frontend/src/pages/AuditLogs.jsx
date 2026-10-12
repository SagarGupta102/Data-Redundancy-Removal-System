import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./AuditLogs.css";

function AuditLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await apiFetch("/api/activity");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load audit logs.");
        }

        setActivities(data.activities || []);
      } catch (err) {
        setError(err.message || "Unable to load audit logs.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  function getStatusClass(status) {
    if (status === "Record Added") return "audit-status-added";
    if (status === "Duplicate Detected") return "audit-status-duplicate";
    if (status === "Invalid Attempt") return "audit-status-invalid";
    if (status === "Possible Duplicate") return "audit-status-review";

    return "";
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Audit Logs</p>
          <h1>Audit Logs</h1>
          <p className="page-description">
            Track recent data validation and record activities.
          </p>
        </div>
      </header>

      <section className="content-panel">
        <div className="audit-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest activities recorded by DataGuard.</p>
          </div>

          <div className="audit-count">
            <span>Total Activities Shown</span>
            <strong>{activities.length}</strong>
          </div>
        </div>

        {loading ? (
          <p>Loading audit logs...</p>
        ) : error ? (
          <p className="audit-error">{error}</p>
        ) : activities.length === 0 ? (
          <p className="audit-empty">No activity found yet.</p>
        ) : (
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Activity</th>
                  <th>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {activities.map((activity, index) => (
                  <tr key={activity.id || index}>
                    <td>{index + 1}</td>
                    <td>{activity.name || "—"}</td>
                    <td>{activity.email || "—"}</td>
                    <td>
                      <span
                        className={`audit-status ${getStatusClass(
                          activity.status
                        )}`}
                      >
                        {activity.status || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {activity.createdAt
                        ? new Date(activity.createdAt).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AuditLogs;