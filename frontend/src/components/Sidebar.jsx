
function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { icon: "▦", label: "Dashboard" },
    { icon: "▤", label: "All Records" },
    { icon: "+", label: "Add Record" },
    { icon: "⧉", label: "Duplicates" },
    { icon: "◉", label: "Possible Duplicates" },
    { icon: "⚠", label: "Invalid Records" },
    { icon: "◷", label: "Audit Logs" },
    { icon: "⚙", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">DR</div>
        <div>
          <h2>DataGuard</h2>
          <p>Data Quality System</p>
        </div>
      </div>

      <p className="menu-heading">MAIN MENU</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            className={`nav-item ${
              activePage === item.label ? "active" : ""
            }`}
            key={item.label}
            type="button"
            onClick={() => setActivePage(item.label)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>
        <div>
          <p>System Status</p>
          <span>Ready to monitor</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;