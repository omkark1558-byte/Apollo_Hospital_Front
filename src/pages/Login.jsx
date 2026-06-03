import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/login", form);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand login-brand">
          <div className="brand-mark">AH</div>
          <div>
            <h1>Apollo Hospital</h1>
            <p>Admin Console</p>
          </div>
        </div>

        <div className="login-copy">
          <p className="eyebrow">Secure access</p>
          <h2>Sign in to manage operations</h2>
          <p>Use your hospital admin credentials to access doctors, patients, and appointments.</p>
        </div>

        <form className="form-grid-inner" onSubmit={handleLogin}>
          <label>
            Username
            <input required name="username" value={form.username} onChange={handleChange} placeholder="admin" />
          </label>
          <label>
            Password
            <input required name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
