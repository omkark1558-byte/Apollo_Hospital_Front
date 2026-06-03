import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  addPatient,
  deletePatient,
  getPatients,
  searchPatient,
  sortPatient,
  updatePatient,
} from "../services/api";

const initialForm = {
  p_name: "",
  p_email: "",
  p_gender: "",
  p_age: "",
  p_mobileno: "",
  doctorId: "",
};

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(patients.length / itemsPerPage));

  const currentPatients = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return patients.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, patients]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await getPatients();
      setPatients(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPatients();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setIsEdit(false);
    setEditId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await updatePatient(editId, form);
        toast.success("Patient updated successfully");
      } else {
        await addPatient(form);
        toast.success("Patient added successfully");
      }

      closeModal();
      loadPatients();
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await deletePatient(id);
      toast.success("Patient deleted");
      loadPatients();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (patient) => {
    setForm({
      p_name: patient.p_name || "",
      p_email: patient.p_email || "",
      p_gender: patient.p_gender || "",
      p_age: patient.p_age || "",
      p_mobileno: patient.p_mobileno || "",
      doctorId: patient.dr?.d_id || patient.doctorId || "",
    });
    setEditId(patient.p_id);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadPatients();
      return;
    }

    setLoading(true);
    try {
      const res = await searchPatient(search.trim());
      setPatients(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (event) => {
    const field = event.target.value;
    if (!field) return;

    setLoading(true);
    try {
      const res = await sortPatient(field);
      setPatients(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch {
      toast.error("Sort failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Patient registry</p>
          <h2>Patient Management</h2>
          <p>Register, search, sort, update, and remove patient profiles.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => setShowModal(true)}>
          Add Patient
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search-group">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search patient by name" />
            <button className="btn btn-secondary" type="button" onClick={handleSearch}>Search</button>
          </div>

          <select onChange={handleSort} defaultValue="">
            <option value="">Sort patients</option>
            <option value="p_name">Name</option>
            <option value="p_age">Age</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Mobile</th>
                <th>Doctor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="empty-cell">Loading patients...</td></tr>
              ) : currentPatients.length === 0 ? (
                <tr><td colSpan="8" className="empty-cell">No patients found</td></tr>
              ) : (
                currentPatients.map((patient) => (
                  <tr key={patient.p_id || patient.p_email}>
                    <td>{patient.p_id || "-"}</td>
                    <td>{patient.p_name || "-"}</td>
                    <td>{patient.p_email || "-"}</td>
                    <td>{patient.p_gender || "-"}</td>
                    <td>{patient.p_age || "-"}</td>
                    <td>{patient.p_mobileno || "-"}</td>
                    <td>{patient.dr?.d_name || patient.doctor?.d_name || "-"}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-small" type="button" onClick={() => handleEdit(patient)}>Edit</button>
                        <button className="btn btn-small danger" type="button" onClick={() => handleDelete(patient.p_id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="btn btn-ghost" type="button" onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="btn btn-ghost" type="button" onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="section-title">
              <div>
                <h3>{isEdit ? "Edit Patient" : "Add Patient"}</h3>
                <p>{isEdit ? "Update existing registration details." : "Create a new patient registration."}</p>
              </div>
              <button className="icon-btn" type="button" onClick={closeModal} aria-label="Close">X</button>
            </div>

            <form className="form-grid-inner two-col" onSubmit={handleSubmit}>
              <label>Name<input required name="p_name" value={form.p_name} onChange={handleChange} placeholder="Patient name" /></label>
              <label>Email<input required type="email" name="p_email" value={form.p_email} onChange={handleChange} placeholder="patient@email.com" /></label>
              <label>Gender<select required name="p_gender" value={form.p_gender} onChange={handleChange}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Other</option></select></label>
              <label>Age<input required type="number" min="0" name="p_age" value={form.p_age} onChange={handleChange} placeholder="32" /></label>
              <label>Mobile<input required name="p_mobileno" value={form.p_mobileno} onChange={handleChange} placeholder="9876543210" /></label>
              <label>Doctor ID<input name="doctorId" value={form.doctorId} onChange={handleChange} placeholder="Assigned doctor ID" /></label>

              <div className="form-actions full-span">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Patient" : "Add Patient"}
                </button>
                <button className="btn btn-ghost" type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
