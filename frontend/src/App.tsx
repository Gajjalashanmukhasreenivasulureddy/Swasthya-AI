import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import { useAuth } from "./hooks/useAuth";

import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage";
import RoleSelection from "./components/RoleSelection";

import DoctorLogin from "./doctors/DoctorLogin";
import DoctorDashboard from "./doctors/DoctorDashboard";
import PatientProfile from "./doctors/PatientProfile";
import PatientQueue from "./doctors/PatientQueue";
import DoctorSchedule from "./doctors/DoctorSchedule";
import AICaseSheet from "./doctors/AICaseSheet";

import PatientLogin from "./patients/PatientLogin";
import PatientDashboard from "./patients/PatientDashboard";
import AICaseTaking from "./patients/AICaseTaking";
import CaseReview from "./patients/CaseReview";
import MedicalRecords from "./patients/MedicalRecords";
import UploadReports from "./patients/UploadReports";

function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <button
      type="button"
      className="global-theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}

function AppRoutes() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Doctor Flow - unchanged */}
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<RequireAuth role="doctor"><DoctorDashboard /></RequireAuth>} />
        <Route path="/doctor/patients" element={<RequireAuth role="doctor"><PatientProfile /></RequireAuth>} />
        <Route path="/doctor/queue" element={<RequireAuth role="doctor"><PatientQueue /></RequireAuth>} />
        <Route path="/doctor/schedule" element={<RequireAuth role="doctor"><DoctorSchedule /></RequireAuth>} />
        <Route path="/doctor/case-sheet" element={<RequireAuth role="doctor"><AICaseSheet /></RequireAuth>} />

        {/* Patient Flow */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<RequireAuth role="patient"><PatientDashboard /></RequireAuth>} />
        <Route path="/patient/case-taking" element={<RequireAuth role="patient"><AICaseTaking /></RequireAuth>} />
        <Route path="/patient/upload-reports" element={<RequireAuth role="patient"><UploadReports /></RequireAuth>} />
        <Route path="/patient/case-review" element={<RequireAuth role="patient"><CaseReview /></RequireAuth>} />
        <Route path="/patient/medical-records" element={<RequireAuth role="patient"><MedicalRecords /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function RequireAuth({ role, children }: { role: "patient" | "doctor"; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to={role === "doctor" ? "/doctor-login" : "/patient-login"} replace />;
  if (user.role !== role) return <Navigate to={user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
