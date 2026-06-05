import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };

  return (
    <div
      style={{
        height: "60px",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <h3>Apollo Hospital</h3>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}