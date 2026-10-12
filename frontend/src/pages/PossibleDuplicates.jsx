import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./PossibleDuplicates.css";

function PossibleDuplicates() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPossibleDuplicates() {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch("/api/possible-duplicates");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load possible duplicates."
          );
        }

        setRecords(
          Array.isArray(data.possibleDuplicates)
            ? data.possibleDuplicates
            : []
        );
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchPossibleDuplicates();
  }, []);

  function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString();
  }

  function getMatchedFields(fields) {
    if (!Array.isArray(fields) || fields.length === 0) {
      return "Not specified";
    }

    return fields
      .map((field) => {
        if (field === "fullName") return "Name";
        if (field === "phone") return "Phone";
        return field;
      })
      .join(", ");
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Possible Duplicates</p>
          <h1>Possible Duplicates</h1>
          <p className="page-description">
            Review records that may match existing data.
          </p>
        </div>
      </header>

      <section className="possible-duplicates-summary">
        <div className="possible-duplicates-stat-card">
          <span className="possible-duplicates-stat-icon">◉</span>

          <div>
            <p>Records Requiring Review</p>
            <h2>{loading ? "—" : records.length}</h2>
            <span>Potential matches found</span>
          </div>
        </div>
      </section>

      <section className="content-panel possible-duplicates-panel">
        <div className="possible-duplicates-panel-header">
          <div>
            <h2>Potential Matches</h2>
            <p>
              Compare the new records with existing records before taking
              action.
            </p>
          </div>

          <span className="possible-duplicates-count">
            {records.length} records
          </span>
        </div>

        {loading ? (
          <p className="possible-duplicates-message">
            Loading possible duplicates...
          </p>
        ) : error ? (
          <div className="possible-duplicates-message possible-duplicates-error">
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="possible-duplicates-empty">
            <div className="possible-duplicates-empty-icon">✓</div>
            <h3>No possible duplicates found</h3>
            <p>
              Records matching an existing name or phone number will appear
              here for review.
            </p>
          </div>
        ) : (
          <div className="possible-duplicates-table-wrapper">
            <table className="possible-duplicates-table">
              <thead>
                <tr>
                  <th>New Record</th>
                  <th>Existing Record</th>
                  <th>Matched Fields</th>
                  <th>Detection Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((item) => {
                  const newRecord = item.newRecord;
                  const existingRecord = item.existingRecord;

                  return (
                    <tr key={item._id}>
                      <td>
                        {newRecord ? (
                          <div className="possible-record-details">
                            <strong>{newRecord.fullName || "—"}</strong>
                            <span>{newRecord.email || "—"}</span>
                            <span>{newRecord.phone || "—"}</span>
                          </div>
                        ) : (
                          "Record unavailable"
                        )}
                      </td>

                      <td>
                        {existingRecord ? (
                          <div className="possible-record-details">
                            <strong>
                              {existingRecord.fullName || "—"}
                            </strong>
                            <span>{existingRecord.email || "—"}</span>
                            <span>{existingRecord.phone || "—"}</span>
                          </div>
                        ) : (
                          "Record unavailable"
                        )}
                      </td>

                      <td>
                        <div className="matched-fields">
                          {getMatchedFields(item.matchedFields)}
                        </div>
                      </td>

                      <td>{formatDate(item.createdAt)}</td>

                      <td>
                        <span className="possible-review-status">
                          Needs Review
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default PossibleDuplicates;