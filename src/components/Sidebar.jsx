import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "D" },
  { to: "/doctors", label: "Doctors", icon: "DR" },
  { to: "/patients", label: "Patients", icon: "PT" },
  { to: "/appointments", label: "Appointments", icon: "AP" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AH</div>
        <div>
          <h1>Apollo Hospital</h1>
          <p>Admin Console</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="status-dot" />
        Backend connected on port 8080
      </div>
    </aside>
  );
}

export default Sidebar;
