
import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function AllRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecords() {
      try {
        const response = await apiFetch("/api/records");

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load records."
          );
        }

        setRecords(result.records || []);
      } catch (err) {
        setError(
          err.message || "Could not connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecords();
  }, []);

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / All Records</p>
          <h1>All Records</h1>
          <p className="page-description">
            View records saved in your cloud database.
          </p>
        </div>
      </header>

      <section className="content-panel">
        <div className="panel-heading">
          <div>
            <h2>Saved Records</h2>
            <p>
              {loading
                ? "Loading records..."
                : `${records.length} record(s) found`}
            </p>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading records from MongoDB Atlas...</p>
        ) : error ? (
          <p className="records-error">{error}</p>
        ) : records.length === 0 ? (
          <p>No records found. Add a record to get started.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Date Added</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <strong>{record.fullName}</strong>
                    </td>
                    <td>{record.email}</td>
                    <td>{record.phone}</td>
                    <td>{record.department}</td>
                    <td>
                      {record.createdAt
                        ? new Date(
                            record.createdAt
                          ).toLocaleDateString()
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

export default AllRecords;