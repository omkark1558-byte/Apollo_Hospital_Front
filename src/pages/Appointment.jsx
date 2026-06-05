import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  addAppointment,
  deleteAppointment,
  getAppointments,
  getDoctors,
  getPatients,
  updateAppointment,
} from "../services/api";

const initialForm = {
  patientId: "",
  doctorId: "",
  appointmentDate: "",
  status: "BOOKED",
};

const getAppointmentId = (appointment) =>
  appointment.a_id || appointment.id || appointment.appointmentId;

const getDoctorName = (doctor) => doctor?.d_name || doctor?.name || "Unknown doctor";
const getPatientName = (patient) => patient?.p_name || patient?.name || "Unknown patient";

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const [appointmentRes, doctorRes, patientRes] = await Promise.all([
        getAppointments(),
        getDoctors(),
        getPatients(),
      ]);

      setAppointments(Array.isArray(appointmentRes.data) ? appointmentRes.data : []);
      setDoctors(Array.isArray(doctorRes.data) ? doctorRes.data : []);
      setPatients(Array.isArray(patientRes.data) ? patientRes.data : []);
    } catch {
      toast.error("Appointment data load failed. Please start backend on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (statusFilter === "All") return appointments;
    return appointments.filter((appointment) => appointment.status === statusFilter);
  }, [appointments, statusFilter]);

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

  const buildCreatePayload = () => ({
    doctorId: Number(form.doctorId),
    patientId: Number(form.patientId),
    appointmentDate: form.appointmentDate,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        await updateAppointment(editId, { status: form.status });
        toast.success("Appointment status updated");
      } else {
        await addAppointment(buildCreatePayload());
        toast.success("Appointment booked successfully");
      }

      resetForm();
      loadAppointments();
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data || "Appointment save failed";
      toast.error(String(message));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (appointment) => {
    setEditId(getAppointmentId(appointment));
    setForm({
      patientId: appointment.patient?.p_id || appointment.pt?.p_id || "",
      doctorId: appointment.doctor?.d_id || appointment.dr?.d_id || "",
      appointmentDate: appointment.appointmentDate || "",
      status: appointment.status || "BOOKED",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("Appointment id missing");
      return;
    }

    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await deleteAppointment(id);
      toast.success("Appointment cancelled");
      loadAppointments();
    } catch {
      toast.error("Cancel failed");
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Bookings</p>
          <h2>Appointment Management</h2>
          <p>Book appointments with backend-ready doctor, patient, and date mapping.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowForm(true)}>
          Book Appointment
        </button>
      </div>

      <div className="stats-grid compact-stats">
        <article className="mini-stat">
          <span>Total</span>
          <strong>{appointments.length}</strong>
        </article>
        <article className="mini-stat success">
          <span>Booked</span>
          <strong>{appointments.filter((item) => item.status === "BOOKED").length}</strong>
        </article>
        <article className="mini-stat muted">
          <span>Doctors / Patients</span>
          <strong>{doctors.length} / {patients.length}</strong>
        </article>
      </div>

      {showForm && (
        <section className="panel compact-panel">
          <div className="section-title">
            <div>
              <h3>{editId ? "Update Status" : "Book Appointment"}</h3>
              <p>{editId ? "Change appointment status only." : "Select records from backend-loaded dropdowns."}</p>
            </div>
          </div>

          <form className="form-grid-inner appointment-form" onSubmit={handleSubmit}>
            {!editId && (
              <>
                <label>
                  Patient
                  <select required name="patientId" value={form.patientId} onChange={handleChange}>
                    <option value="">Select patient</option>
                    {patients.map((patient) => (
                      <option key={patient.p_id} value={patient.p_id}>
                        #{patient.p_id} - {getPatientName(patient)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Doctor
                  <select required name="doctorId" value={form.doctorId} onChange={handleChange}>
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.d_id} value={doctor.d_id}>
                        #{doctor.d_id} - {getDoctorName(doctor)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Appointment Date
                  <input required type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} />
                </label>
              </>
            )}

            {editId && (
              <label>
                Status
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="BOOKED">BOOKED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </label>
            )}

            <div className="form-actions full-span">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editId ? "Update Status" : "Book Now"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="toolbar">
          <div>
            <h3>Appointments</h3>
            <p>{filteredAppointments.length} records visible</p>
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All status</option>
            <option value="BOOKED">BOOKED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="empty-cell">Loading appointments...</td></tr>
              ) : filteredAppointments.length === 0 ? (
                <tr><td colSpan="6" className="empty-cell">No appointments found</td></tr>
              ) : (
                filteredAppointments.map((appointment) => {
                  const id = getAppointmentId(appointment);
                  return (
                    <tr key={id}>
                      <td>{id || "-"}</td>
                      <td>{getPatientName(appointment.patient || appointment.pt)}</td>
                      <td>{getDoctorName(appointment.doctor || appointment.dr)}</td>
                      <td>{appointment.appointmentDate || "-"}</td>
                      <td><span className={`tag status-${String(appointment.status || "").toLowerCase()}`}>{appointment.status || "BOOKED"}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-small" type="button" onClick={() => handleEdit(appointment)}>Status</button>
                          <button className="btn btn-small danger" type="button" onClick={() => handleDelete(id)}>Cancel</button>
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
