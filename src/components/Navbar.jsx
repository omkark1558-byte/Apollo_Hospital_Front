import { logout } from "../services/auth";

function Navbar() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Hospital Management System</p>
        <h2>Clinical Operations</h2>
      </div>

      <div className="topbar-actions">
        <div className="admin-chip">
          <span className="avatar">A</span>
          <span>Admin</span>
        </div>
        <button className="btn btn-ghost" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
