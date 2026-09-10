import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-selection-container">
      <div className="header-section">
        <div className="logo-header">
           <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#0D9488"/>
              <path d="M11.2002 10H20C20.237 10 20.5234 10.1161 20.7744 10.4297C21.0302 10.7494 21.2002 11.2226 21.2002 11.75V15.5H24.7891C24.7973 15.5069 24.8101 15.5188 24.8242 15.5381L24.875 15.6318L26.5674 19.8594V19.8604C26.6734 20.126 26.8263 20.3767 27.0244 20.5918C27.2228 20.8071 27.4662 20.9853 27.7471 21.1025L27.748 21.1035L29.8633 21.9844C29.8522 21.9797 29.8846 21.9903 29.9258 22.0615C29.9672 22.1332 29.9999 22.2399 30 22.3652V26.875C30 27.0378 29.946 27.1608 29.8965 27.2227C29.8849 27.2372 29.8744 27.2449 29.8682 27.25H26.7002V28.25C26.7002 29.4363 25.966 30 25.5 30C25.034 30 24.2998 29.4363 24.2998 28.25V27.25H15.7002V28.25C15.7002 29.4363 14.966 30 14.5 30C14.034 30 13.2998 29.4363 13.2998 28.25V27.25H10.1318C10.1256 27.2449 10.1151 27.2372 10.1035 27.2227C10.054 27.1608 10 27.0378 10 26.875V11.75C10 11.2226 10.169 10.7494 10.4248 10.4297C10.6759 10.1158 10.9631 10 11.2002 10Z" stroke="white" strokeWidth="2"/>
            </svg>
            <div>
              <h2>Swasthya</h2>
              <p className="hackathon-subtitle">SMART INDIA HACKATHON</p>
            </div>
        </div>
        <h1 className="main-title">How will you use Swasthya?</h1>
        <p className="main-subtitle">Select your account type to access the pre-consultation portal.</p>
      </div>

      <div className="cards-wrapper">
        <div className="role-card">
          <div className="icon-circle doctor-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A202C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h3>I am a Doctor</h3>
          <p>Access your OPD clinic queue, view structured pre-consult summaries, and manage diagnostic timelines.</p>
          <button className="doctor-btn" onClick={() => navigate('/doctor-login')}>
            Access Doctor Portal
          </button>
        </div>

        <div className="role-card">
          <div className="icon-circle patient-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#009688" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3>I am a Patient</h3>
          <p>Explain your symptoms via voice/text, upload past laboratory reports, and generate structured sheets.</p>
          <button className="patient-btn" onClick={() => navigate('/patient-login')}>
            Start Intake Guided System
          </button>
        </div>
      </div>

      <p className="footer-text">By continuing, you agree to our Terms of Service & clinical workflow protocols.</p>
    </div>
  );
}

export default RoleSelection;