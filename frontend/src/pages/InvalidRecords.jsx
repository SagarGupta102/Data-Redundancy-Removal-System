import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./InvalidRecords.css";

function InvalidRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvalidRecords() {
      try {
        const response = await apiFetch("/api/invalid-attempts");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load invalid records.");
        }

        setRecords(data.invalidAttempts || []);
      } catch (err) {
        setError(err.message || "Unable to load invalid records.");
      } finally {
        setLoading(false);
      }
    }

    fetchInvalidRecords();
  }, []);

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Invalid Records</p>
          <h1>Invalid Records</h1>
          <p className="page-description">
            Review data entries that failed validation.
          </p>
        </div>
      </header>

      <section className="content-panel">
        <div className="invalid-records-header">
          <div>
            <h2>Invalid Attempts</h2>
            <p>Records rejected by the validation process.</p>
          </div>

          <div className="invalid-records-count">
            <span>Total Invalid Attempts</span>
            <strong>{records.length}</strong>
          </div>
        </div>

        {loading ? (
          <p>Loading invalid records...</p>
        ) : error ? (
          <p className="invalid-error">{error}</p>
        ) : records.length === 0 ? (
          <p className="invalid-empty">
            No invalid attempts found.
          </p>
        ) : (
          <div className="invalid-table-wrapper">
            <table className="invalid-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record, index) => (
                  <tr key={record._id || index}>
                    <td>{index + 1}</td>
                    <td>{record.fullName || record.name || "—"}</td>
                    <td>{record.email || "—"}</td>
                    <td>
                      {record.reason ||
                        record.message ||
                        record.validationError ||
                        "Validation failed"}
                    </td>
                    <td>
                      {record.createdAt
                        ? new Date(record.createdAt).toLocaleString()
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

export default InvalidRecords;