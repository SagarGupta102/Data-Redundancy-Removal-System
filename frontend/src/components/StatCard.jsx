
function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon ${color}`}>{icon}</span>
        <span className="stat-subtitle">{subtitle}</span>
      </div>

      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  );
}

export default StatCard;