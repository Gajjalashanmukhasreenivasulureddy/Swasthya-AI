import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./hooks/useTheme";

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
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/patients" element={<PatientProfile />} />
        <Route path="/doctor/queue" element={<PatientQueue />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/doctor/case-sheet" element={<AICaseSheet />} />

        {/* Patient Flow */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/case-taking" element={<AICaseTaking />} />
        <Route path="/patient/upload-reports" element={<UploadReports />} />
        <Route path="/patient/case-review" element={<CaseReview />} />
        <Route path="/patient/medical-records" element={<MedicalRecords />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
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
