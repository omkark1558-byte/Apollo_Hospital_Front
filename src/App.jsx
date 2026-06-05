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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Pages */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/doctors"
            element={<Doctor />}
          />

          <Route
            path="/patients"
            element={<Patient />}
          />

          <Route
            path="/appointments"
            element={<Appointment />}
          />
        </Route>

        {/* Invalid URL Redirect */}
        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

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