import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { addDoctor, deleteDoctor, getDoctors, updateDoctor } from "../services/api";

const emptyForm = {
  d_name: "",
  d_email: "",
  d_speciality: "",
  d_date: "",
};

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const res = await getDoctors();
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return doctors;

    return doctors.filter((doctor) =>
      [doctor.d_name, doctor.d_email, doctor.d_speciality]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [doctors, search]);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        await updateDoctor(editId, form);
        toast.success("Doctor updated successfully");
      } else {
        await addDoctor(form);
        toast.success("Doctor added successfully");
      }

      resetForm();
      loadDoctors();
    } catch {
      toast.error("Doctor save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditId(doctor.d_id);
    setForm({
      d_name: doctor.d_name || "",
      d_email: doctor.d_email || "",
      d_speciality: doctor.d_speciality || "",
      d_date: doctor.d_date || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await deleteDoctor(id);
      toast.success("Doctor deleted");
      loadDoctors();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Clinical staff</p>
          <h2>Doctor Management</h2>
          <p>Add, update, search, and maintain consultant records.</p>
        </div>
      </div>

      <div className="content-grid form-grid">
        <section className="panel">
          <div className="section-title">
            <div>
              <h3>{editId ? "Edit Doctor" : "Add Doctor"}</h3>
              <p>Keep doctor details accurate for appointment mapping.</p>
            </div>
          </div>

          <form className="form-grid-inner" onSubmit={handleSubmit}>
            <label>
              Doctor Name
              <input required name="d_name" value={form.d_name} onChange={handleChange} placeholder="Dr. Priya Sharma" />
            </label>
            <label>
              Email
              <input required type="email" name="d_email" value={form.d_email} onChange={handleChange} placeholder="doctor@apollo.com" />
            </label>
            <label>
              Speciality
              <input required name="d_speciality" value={form.d_speciality} onChange={handleChange} placeholder="Cardiology" />
            </label>
            <label>
              Joining Date
              <input type="date" name="d_date" value={form.d_date} onChange={handleChange} />
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : editId ? "Update Doctor" : "Add Doctor"}
              </button>
              {editId && (
                <button className="btn btn-ghost" type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel table-panel">
          <div className="section-title">
            <div>
              <h3>Doctors</h3>
              <p>{filteredDoctors.length} records found</p>
            </div>
            <input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search doctors" />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Speciality</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="empty-cell">Loading doctors...</td></tr>
                ) : filteredDoctors.length === 0 ? (
                  <tr><td colSpan="5" className="empty-cell">No doctors found</td></tr>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.d_id || doctor.d_email}>
                      <td>{doctor.d_id || "-"}</td>
                      <td>{doctor.d_name || "-"}</td>
                      <td>{doctor.d_email || "-"}</td>
                      <td><span className="tag">{doctor.d_speciality || "-"}</span></td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-small" type="button" onClick={() => handleEdit(doctor)}>Edit</button>
                          <button className="btn btn-small danger" type="button" onClick={() => handleDelete(doctor.d_id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
