import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { getAppointments, getDoctors, getPatients } from "../services/api";

const toArray = (value) => (Array.isArray(value) ? value : value?.data || []);

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const [doctorRes, patientRes, appointmentRes] = await Promise.allSettled([
        getDoctors(),
        getPatients(),
        getAppointments(),
      ]);

      if (doctorRes.status === "fulfilled") {
        setDoctors(toArray(doctorRes.value.data));
      }

      if (patientRes.status === "fulfilled") {
        setPatients(toArray(patientRes.value.data));
      }

      if (appointmentRes.status === "fulfilled") {
        setAppointments(toArray(appointmentRes.value.data));
      }

      if ([doctorRes, patientRes, appointmentRes].some((res) => res.status === "rejected")) {
        setError("Some dashboard data could not be loaded. Please check backend APIs.");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const recentPatients = useMemo(() => patients.slice(-5).reverse(), [patients]);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Live overview</p>
          <h2>Hospital Dashboard</h2>
          <p>Track doctors, patients, and appointment workload from one place.</p>
        </div>
        <div className="date-pill">{today}</div>
      </div>

      {error && <div className="notice warning">{error}</div>}

      <div className="stats-grid">
        <Card title="Doctors" value={loading ? "..." : doctors.length} tone="blue" helper="Active consultant records" />
        <Card title="Patients" value={loading ? "..." : patients.length} tone="green" helper="Registered patient profiles" />
        <Card title="Appointments" value={loading ? "..." : appointments.length} tone="orange" helper="Total bookings available" />
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="section-title">
            <div>
              <h3>Recent Patients</h3>
              <p>Latest records received from backend</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Doctor</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-cell">No patients found</td>
                  </tr>
                ) : (
                  recentPatients.map((patient) => (
                    <tr key={patient.p_id || patient.id || patient.p_email}>
                      <td>{patient.p_name || "-"}</td>
                      <td>{patient.p_email || "-"}</td>
                      <td>{patient.p_age || "-"}</td>
                      <td>{patient.dr?.d_name || patient.doctor?.d_name || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="panel accent-panel">
          <h3>Operational Health</h3>
          <p>Production UI is ready with guarded loading, responsive layout, empty states, and API error visibility.</p>
          <div className="health-list">
            <span>API base: localhost:8080</span>
            <span>Responsive admin shell</span>
            <span>Toast notifications enabled</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
