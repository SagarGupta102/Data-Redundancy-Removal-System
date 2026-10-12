import Duplicates from "./pages/Duplicates";
import AllRecords from "./pages/AllRecords";
import AddRecord from "./pages/AddRecord";
import PossibleDuplicates from "./pages/PossibleDuplicates";
import InvalidRecords from "./pages/InvalidRecords";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  clearAuthSession,
  isAuthenticated,
} from "./api";
import "./App.css";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function DashboardShell() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(
  () => localStorage.getItem("activePage") || "Dashboard"
);

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  useEffect(() => {
    function handleAuthExpired() {
      navigate("/login", { replace: true });
    }

    window.addEventListener("auth-expired", handleAuthExpired);
    return () => window.removeEventListener("auth-expired", handleAuthExpired);
  }, [navigate]);

  function handleLogout() {
    clearAuthSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {activePage === "Dashboard" ? (
        <Dashboard />
      ) : activePage === "Add Record" ? (
        <AddRecord />
      ) : activePage === "All Records" ? (
        <AllRecords />
      ) : activePage === "Duplicates" ? (
        <Duplicates />
      ) : activePage === "Possible Duplicates" ? (
        <PossibleDuplicates />
      ) : activePage === "Invalid Records" ? (
        <InvalidRecords />
      ) : activePage === "Audit Logs" ? (
        <AuditLogs />
      ) : activePage === "Settings" ? (
        <Settings />
      ) : ( 
        <main className="dashboard">
          <header className="topbar">
            <div>
              <p className="breadcrumb">Workspace / {activePage}</p>
              <h1>{activePage}</h1>
              <p className="page-description">
                Manage and monitor your data quality.
              </p>
            </div>
          </header>

          <section className="content-panel">
            <h2>{activePage}</h2>
            <p>
              This section is ready for development. We will add its
              functionality in the next steps.
            </p>
          </section>
        </main>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardShell />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated() ? "/dashboard" : "/login"}
            replace
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;