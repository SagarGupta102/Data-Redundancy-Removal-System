import "./Dashboard.css";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";

function Dashboard() {
const [totalRecords, setTotalRecords] = useState(0);
const [loadingRecords, setLoadingRecords] = useState(true);

const [duplicateCount, setDuplicateCount] = useState(0);
const [loadingDuplicates, setLoadingDuplicates] = useState(true);

const [invalidCount, setInvalidCount] = useState(0);
const [loadingInvalid, setLoadingInvalid] = useState(true);

const [possibleDuplicateCount, setPossibleDuplicateCount] = useState(0);

const [recentActivity, setRecentActivity] = useState([]);
const [loadingActivity, setLoadingActivity] = useState(true);

useEffect(() => {
  const fetchTotalRecords = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/records");

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await response.json();
      setTotalRecords(data.count);
    } catch (error) {
      console.error("Error fetching total records:", error.message);
    } finally {
      setLoadingRecords(false);
    }
  };

  fetchTotalRecords();
}, []);

useEffect(() => {
  const fetchDuplicates = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/duplicates"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch duplicates");
      }

      const data = await response.json();
      setDuplicateCount(data.count);
    } catch (error) {
      console.error("Error fetching duplicates:", error.message);
    } finally {
      setLoadingDuplicates(false);
    }
  };

  fetchDuplicates();
}, []);


useEffect(() => {
  const fetchInvalidAttempts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/invalid-attempts"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch invalid attempts");
      }

      const data = await response.json();
      setInvalidCount(data.count);
    } catch (error) {
      console.error(
        "Error fetching invalid attempts:",
        error.message
      );
    } finally {
      setLoadingInvalid(false);
    }
  };

  fetchInvalidAttempts();
}, []);

useEffect(() => {
  fetch("http://localhost:5000/api/possible-duplicates")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch possible duplicates");
      }
      return response.json();
    })
    .then((data) => {
      setPossibleDuplicateCount(data.count);
    })
    .catch((error) => {
      console.error("Possible duplicates fetch failed:", error);
    });
}, []);

useEffect(() => {
  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/activity"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recent activity");
      }

      const data = await response.json();
      setRecentActivity(data.activities || []);
    } catch (error) {
      console.error("Recent activity fetch failed:", error.message);
    } finally {
      setLoadingActivity(false);
    }
  };

  fetchRecentActivity();
}, []);

  const stats = [
    {
      title: "Total Records",
      value: loadingRecords ? "Loading..." : totalRecords.toLocaleString(),
      icon: "▤",
      color: "blue",
      subtitle: "All submitted records",
    },
    {
      title: "Unique Records",
      value: loadingRecords ? "Loading..." : totalRecords.toLocaleString(), // Assuming the other categories are known
      icon: "✓",
      color: "green",
      subtitle: "Verified unique entries",
    },
    {
      title: "Duplicates",
      value: loadingDuplicates ? "Loading..." : duplicateCount.toLocaleString(),
      icon: "⧉",
      color: "orange",
      subtitle: "Exact matches detected",
    },
    {
      title: "Possible Duplicates",
      value: possibleDuplicateCount.toLocaleString(),
      icon: "◉",
      color: "purple",
      subtitle: "Need manual review",
    },
    {
      title: "Invalid Records",
      value: loadingInvalid ? "Loading..." : invalidCount.toLocaleString(),
      icon: "!",
      color: "red",
      subtitle: "Failed validation",
    },
  ];

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Overview</p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Monitor, validate, and manage your data quality.
          </p>
        </div>

        <div className="profile">
          <div className="profile-avatar">SG</div>
          <div>
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
        </div>
      </header>

      <section className="welcome-banner">
        <div>
          <p className="welcome-label">DATA QUALITY OVERVIEW</p>
          <h2>Welcome to DataGuard</h2>
          <p>
            Keep your database clean by identifying duplicates and validating
            incoming records.
          </p>
        </div>
        <div className="banner-symbol">✓</div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="content-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest records processed by the system</p>
          </div>

          <button className="secondary-button" type="button">
            View all
          </button>
        </div>

        <div className="table-wrapper">
          <table className="recent-activity-table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Email</th>
                <th>Status</th>
                <th>Processed</th>
              </tr>
            </thead>

            <tbody>
  {loadingActivity ? (
    <tr>
      <td colSpan="4">Loading recent activity...</td>
    </tr>
  ) : recentActivity.length === 0 ? (
    <tr>
      <td colSpan="4">No recent activity found.</td>
    </tr>
  ) : (
    recentActivity.map((record) => (
      <tr key={record.id}>
        <td>
          <strong>{record.name}</strong>
        </td>

        <td>{record.email}</td>

        <td>
          <span
            className={`status-badge ${record.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {record.status}
          </span>
        </td>

        <td>
          {record.createdAt
            ? new Date(record.createdAt).toLocaleString()
            : "Unknown"}
        </td>
      </tr>
    ))
  )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="dashboard-footer">
        DataGuard · Data Redundancy Removal System
      </footer>
    </main>
  );
}

export default Dashboard;