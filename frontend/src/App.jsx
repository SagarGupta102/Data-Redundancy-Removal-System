import AllRecords from "./pages/AllRecords";
import AddRecord from "./pages/AddRecord";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState(
  () => localStorage.getItem("activePage") || "Dashboard"
);

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

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

export default App;