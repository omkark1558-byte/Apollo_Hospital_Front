import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../services/api";

const initialForm = {
  patientId: "",
  doctorId: "",
  a_date: "",
  a_time: "",
  reason: "",
  status: "Scheduled",
};

const getAppointmentId = (appointment) =>
  appointment.a_id || appointment.id || appointment.appointmentId;

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAppointments();
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAppointments();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await updateAppointment(editId, form);
        toast.success("Appointment updated");
      } else {
        await addAppointment(form);
        toast.success("Appointment booked");
      }

      resetForm();
      loadAppointments();
    } catch {
      toast.error("Appointment save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditId(getAppointmentId(appointment));
    setForm({
      patientId: appointment.patientId || appointment.patient?.p_id || appointment.pt?.p_id || "",
      doctorId: appointment.doctorId || appointment.doctor?.d_id || appointment.dr?.d_id || "",
      a_date: appointment.a_date || appointment.date || "",
      a_time: appointment.a_time || appointment.time || "",
      reason: appointment.reason || appointment.description || "",
      status: appointment.status || "Scheduled",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await deleteAppointment(id);
      toast.success("Appointment deleted");
      loadAppointments();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Bookings</p>
          <h2>Appointment Management</h2>
          <p>Create and maintain doctor-patient appointment bookings.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowForm(true)}>
          New Appointment
        </button>
      </div>

      {showForm && (
        <section className="panel">
          <div className="section-title">
            <div>
              <h3>{editId ? "Edit Appointment" : "Book Appointment"}</h3>
              <p>Use backend doctor and patient IDs for accurate mapping.</p>
            </div>
          </div>

          <form className="form-grid-inner appointment-form" onSubmit={handleSubmit}>
            <label>Patient ID<input required name="patientId" value={form.patientId} onChange={handleChange} placeholder="Patient ID" /></label>
            <label>Doctor ID<input required name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="Doctor ID" /></label>
            <label>Date<input required type="date" name="a_date" value={form.a_date} onChange={handleChange} /></label>
            <label>Time<input required type="time" name="a_time" value={form.a_time} onChange={handleChange} /></label>
            <label>Status<select name="status" value={form.status} onChange={handleChange}><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select></label>
            <label className="full-span">Reason<textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Consultation reason" rows="3" /></label>

            <div className="form-actions full-span">
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Saving..." : editId ? "Update Appointment" : "Book Appointment"}</button>
              <button className="btn btn-ghost" type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="section-title">
          <div>
            <h3>Appointments</h3>
            <p>{appointments.length} booking records</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="empty-cell">Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="7" className="empty-cell">No appointments found</td></tr>
              ) : (
                appointments.map((appointment) => {
                  const id = getAppointmentId(appointment);
                  return (
                    <tr key={id || `${appointment.patientId}-${appointment.doctorId}-${appointment.a_date}`}>
                      <td>{id || "-"}</td>
                      <td>{appointment.patient?.p_name || appointment.pt?.p_name || appointment.patientId || "-"}</td>
                      <td>{appointment.doctor?.d_name || appointment.dr?.d_name || appointment.doctorId || "-"}</td>
                      <td>{appointment.a_date || appointment.date || "-"}</td>
                      <td>{appointment.a_time || appointment.time || "-"}</td>
                      <td><span className="tag">{appointment.status || "Scheduled"}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-small" type="button" onClick={() => handleEdit(appointment)}>Edit</button>
                          <button className="btn btn-small danger" type="button" onClick={() => handleDelete(id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
