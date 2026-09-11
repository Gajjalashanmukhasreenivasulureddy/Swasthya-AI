import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./LandingPage.css";

type IconName = "arrow" | "check" | "moon" | "sun" | "menu" | "close" | "mic" | "document" | "doctor";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, ReactElement> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    moon: <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.9 6.1l1.41-1.41" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" /><path d="M8 13h8M8 17h5" /></>,
    doctor: <><path d="M6 4h12v5a6 6 0 0 1-12 0zM12 15v6M9 21h6M12 6v5M9.5 8.5h5" /></>,
  };
  return <svg {...common} aria-hidden="true">{paths[name]}</svg>;
}

function Brand() {
  return <span className="brand"><span className="brand-mark"><Icon name="document" size={20} /></span><span><strong className="brand-name">Swasthya</strong><small>SMART INDIA HACKATHON</small></span></span>;
}

const steps = [
  ["01", "Patient checks in", "Choose your language and start from any device."],
  ["02", "AI-guided intake", "Share symptoms by voice or text, at your own pace."],
  ["03", "Case gets organized", "Reports and history become a clear clinical summary."],
  ["04", "Doctor gets context", "Your consultation starts with the details that matter."],
];

const capabilities = [
  ["mic", "Multilingual voice input", "Explain what you feel in the language you trust. Swasthya translates and structures the details for your care team."],
  ["document", "Smart report reading", "Bring PDFs, prescriptions, and lab scans together without searching through a folder during your visit."],
  ["doctor", "Useful clinical summaries", "Doctors see organized histories, active medicines, and important flags before the consultation begins."],
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const goToRoleSelection = () => navigate("/role-selection");
  const goToDoctorLogin = () => navigate("/doctor-login");
  const goToPatientLogin = () => navigate("/patient-login");

  return (
    <main className={`landing-page ${dark ? "theme-dark" : ""}`}>
      <header className="site-header">
        <button className="brand-button" onClick={() => scrollTo("home")} aria-label="Go to Swasthya home"><Brand /></button>
        <nav className="desktop-nav" aria-label="Main navigation"><button className="active" onClick={() => scrollTo("home")}>Home</button><button onClick={() => scrollTo("how-it-works")}>How it works</button><button onClick={() => scrollTo("for-doctors")}>For doctors</button><button onClick={() => scrollTo("for-patients")}>For patients</button><Link to="/about">About</Link></nav>
        <div className="header-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}><Icon name={dark ? "sun" : "moon"} size={18} /></button><button className="login-link" onClick={goToRoleSelection}>Log in</button><button className="button button-small" onClick={goToRoleSelection}>Get started <Icon name="arrow" size={16} /></button></div>
        <button className="mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation"><Icon name={menuOpen ? "close" : "menu"} /></button>
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><button onClick={() => scrollTo("home")}>Home</button><button onClick={() => scrollTo("how-it-works")}>How it works</button><button onClick={() => scrollTo("for-doctors")}>For doctors</button><button onClick={() => scrollTo("for-patients")}>For patients</button><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link><button onClick={goToRoleSelection}>Get started</button></nav>}
      </header>

      <section id="home" className="hero-section"><div className="hero-copy"><p className="eyebrow">A calmer start to every consultation</p><h1>Healthcare begins with being <em>heard.</em></h1><p className="hero-lede">Swasthya helps patients share symptoms in their own words and gives doctors a structured, meaningful view before the consultation starts.</p><div className="hero-actions"><button className="button" onClick={goToRoleSelection}>Start your case <Icon name="arrow" size={18} /></button><button className="quiet-button" onClick={() => scrollTo("how-it-works")}>See how it works <span aria-hidden="true">↓</span></button></div><p className="trust-note"><Icon name="check" size={17} /> Assistive by design. Your doctor always makes the final clinical decision.</p></div><div className="hero-visual" aria-label="Preview of an organized patient case" role="img"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="case-window"><div className="case-top"><span className="status-dot" /><span>AI case summary</span><b>READY FOR REVIEW</b></div><div className="patient-line"><span className="avatar">RS</span><div><strong>Rohan Sharma</strong><small>34 years · Hindi input</small></div><span className="case-check"><Icon name="check" size={15} /></span></div><div className="case-highlight"><small>PRIMARY CONCERN</small><strong>Dry cough for 3 weeks</strong><span>Voice intake translated and organized</span></div><div className="case-bars"><span /><span /><span /></div><div className="case-footer"><span>4 symptoms captured</span><span>2 reports read</span></div></div></div></section>

      <section id="how-it-works" className="section light-section"><div className="section-heading"><p className="eyebrow">Simple by design</p><h2>From your story to a clearer visit.</h2><p>One gentle flow that gives patients room to explain and doctors more time to care.</p></div><div className="steps-grid">{steps.map(([number, title, description]) => <article className="step-item" key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>

      <section className="section capability-section"><div className="section-heading left-heading"><p className="eyebrow">What Swasthya brings together</p><h2>Technology that stays out of the way.</h2></div><div className="capability-grid">{capabilities.map(([icon, title, description]) => <article className="capability-item" key={title}><span className="capability-icon"><Icon name={icon as IconName} size={22} /></span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>

      <section className="audience-section"><div id="for-doctors" className="audience-panel doctor-panel"><p className="eyebrow">For doctors</p><h2>Walk into the room ready.</h2><p>Get the clinical context you need without spending the first minutes reconstructing a patient&apos;s story.</p><ul><li><Icon name="check" size={18} /> Structured histories that scan quickly</li><li><Icon name="check" size={18} /> Key warnings surfaced early</li><li><Icon name="check" size={18} /> More attention for the person in front of you</li></ul><button className="panel-link" onClick={goToDoctorLogin}>Access doctor portal <Icon name="arrow" size={17} /></button></div><div id="for-patients" className="audience-panel patient-panel"><p className="eyebrow">For patients</p><h2>Your voice belongs in your care.</h2><p>Take your time, use the language that feels right, and bring your history with you.</p><ul><li><Icon name="check" size={18} /> Voice and text in 12+ Indian languages</li><li><Icon name="check" size={18} /> No medical vocabulary required</li><li><Icon name="check" size={18} /> Your information stays yours</li></ul><button className="panel-link" onClick={goToPatientLogin}>Start patient intake <Icon name="arrow" size={17} /></button></div></section>

      <section className="final-cta"><p className="eyebrow">Ready when you are</p><h2>Make the next consultation count.</h2><button className="button" onClick={goToRoleSelection}>Get started with Swasthya <Icon name="arrow" size={18} /></button></section>

      <footer className="site-footer"><div className="footer-main"><div><Brand /><p>AI-assisted pre-consultation for more human healthcare.</p></div><div className="footer-column"><strong>Explore</strong><button onClick={() => scrollTo("how-it-works")}>How it works</button><Link to="/about">About Swasthya</Link><button onClick={() => scrollTo("for-doctors")}>For doctors</button></div><div className="footer-column"><strong>Get started</strong><Link to="/doctor-login">Doctor portal</Link><Link to="/patient-login">Patient intake</Link><Link to="/role-selection">Choose your role</Link></div></div><div className="footer-bottom"><span>© 2026 Swasthya SIH Project</span><span>Built for clearer care in India</span></div></footer>
  </main>
  );
}
