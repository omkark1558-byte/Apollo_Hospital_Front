import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import MainLayout from "./layouts/MainLayout";
import Appointment from "./pages/Appointment";
import Dashboard from "./pages/Dashboard";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import Patient from "./pages/Patient";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/doctors" element={<Doctor />} />
          <Route path="/patients" element={<Patient />} />
          <Route path="/appointments" element={<Appointment />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
