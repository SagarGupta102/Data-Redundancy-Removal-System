import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./Duplicates.css";

function Duplicates() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDuplicates() {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/duplicates");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load duplicate attempts."
          );
        }

        setDuplicates(
          Array.isArray(data.duplicates) ? data.duplicates : []
        );
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchDuplicates();
  }, []);

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString();
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Duplicates</p>
          <h1>Duplicates</h1>
          <p className="page-description">
            Review records rejected because they already exist.
          </p>
        </div>
      </header>

      <section className="duplicates-summary">
        <div className="duplicates-stat-card">
          <span className="duplicates-stat-icon">⧉</span>

          <div>
            <p>Total Duplicate Attempts</p>
            <h2>{loading ? "—" : duplicates.length}</h2>
            <span>Recorded by the system</span>
          </div>
        </div>
      </section>

      <section className="content-panel duplicates-panel">
        <div className="duplicates-panel-header">
          <div>
            <h2>Duplicate Attempts</h2>
            <p>Records submitted with an email that already exists.</p>
          </div>

          <span className="duplicates-count">
            {duplicates.length} records
          </span>
        </div>

        {loading ? (
          <p className="duplicates-message">
            Loading duplicate attempts...
          </p>
        ) : error ? (
          <div className="duplicates-message duplicates-error">
            {error}
          </div>
        ) : duplicates.length === 0 ? (
          <div className="duplicates-empty">
            <div className="duplicates-empty-icon">✓</div>
            <h3>No duplicate attempts found</h3>
            <p>
              When a duplicate record is rejected, it will appear here.
            </p>
          </div>
        ) : (
          <div className="duplicates-table-wrapper">
            <table className="duplicates-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Attempt Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {duplicates.map((record) => (
                  <tr key={record._id}>
                    <td>{record.fullName || "—"}</td>
                    <td>{record.email || "—"}</td>
                    <td>{record.phone || "—"}</td>
                    <td>{record.department || "—"}</td>
                    <td>{formatDate(record.createdAt)}</td>
                    <td>
                      <span className="duplicate-status">
                        Duplicate
                      </span>
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

export default Duplicates;