import axios from "axios";
import { getToken } from "./auth";

const API = axios.create({
    baseURL: "http://localhost:8080",
});
API.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
export const getDoctors = () => API.get("/get-doctor");

export const addDoctor = (data) =>
    API.post("/add-doctor", data);

export const deleteDoctor = (id) =>
    API.delete(`/delete-doctor/${id}`);

export const updateDoctor = (id, data) =>
    API.put(`/update-doctor/${id}`, data);
export const getPatients = () =>
    API.get("/get-patient");

export const addPatient = (data) =>
    API.post("/add-patient", data);

export const deletePatient = (id) =>
    API.delete(`/delete-patient/${id}`);

export const searchPatient = (name) =>
    API.get(`/search-patient/${name}`);

export const sortPatient = (field) =>
    API.get(`/patient-sort?field=${field}`);

export const updatePatient = (id, data) =>
    API.put(`/update-patient/${id}`, data);

export const getAppointments = () =>
    API.get("/get-appointment");

export const addAppointment = (data) =>
    API.post("/add-appointment", data);

export const updateAppointment = (id, data) =>
    API.put(`/update-appointment/${id}`, data);

export const deleteAppointment = (id) =>
    API.delete(`/delete-appointment/${id}`);

export default API;
