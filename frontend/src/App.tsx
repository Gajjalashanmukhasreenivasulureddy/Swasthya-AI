import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import AboutPage from "./components/AboutPage";
import RoleSelection from "./components/RoleSelection";

import DoctorLogin from "./doctors/DoctorLogin";
import DoctorDashboard from "./doctors/DoctorDashboard";
import PatientQueue from "./doctors/PatientQueue";
import PatientProfile from "./doctors/PatientProfile";
import AICaseSheet from "./doctors/AICaseSheet";
import DoctorSchedule from "./doctors/DoctorSchedule";

import PatientDashboard from "./patients/PatientDashboard";
import PatientLogin from "./patients/PatientLogin";
import AICaseTaking from "./patients/AICaseTaking";
import UploadReports from "./patients/UploadReports";
import CaseReview from "./patients/CaseReview";
import MedicalRecords from "./patients/MedicalRecords";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Doctor */}
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/doctor/patients"
          element={<PatientProfile />}
        />

        <Route
          path="/doctor/queue"
          element={<PatientQueue />}
        />

        <Route
          path="/doctor/schedule"
          element={<DoctorSchedule />}
        />

        <Route
          path="/doctor/case-sheet"
          element={<AICaseSheet />}
        />

        {/* Patient */}
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/patient/case-taking"
          element={<AICaseTaking />}
        />

        <Route
          path="/patient/upload-reports"
          element={<UploadReports />}
        />

        <Route
          path="/patient/case-review"
          element={<CaseReview />}
        />

        <Route
          path="/patient/medical-records"
          element={<MedicalRecords />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;