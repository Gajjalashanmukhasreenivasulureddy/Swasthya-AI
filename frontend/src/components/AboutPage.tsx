import { Link } from "react-router-dom";
import "./LandingPage.css";

type IconProps = { size?: number };

function BrandMark({ size = 40 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0D9488" />
      <path d="M11.2 10H20c.24 0 .52.12.77.43.26.32.43.79.43 1.32v3.75h3.59c.01.01.02.02.04.04l.05.1 1.69 4.23c.11.27.26.52.46.73.2.22.44.39.72.51l2.12.88c-.01 0 .02.01.06.08.04.07.07.18.07.3v4.51c0 .16-.05.29-.1.35-.01.01-.02.02-.03.03H26.7v1c0 1.19-.73 1.75-1.2 1.75-.47 0-1.2-.56-1.2-1.75v-1h-8.6v1c0 1.19-.73 1.75-1.2 1.75-.47 0-1.2-.56-1.2-1.75v-1h-3.17a.42.42 0 0 1-.03-.03c-.05-.06-.1-.19-.1-.35V11.75c0-.53.17-1 .42-1.32.25-.31.54-.43.78-.43Z" stroke="white" strokeWidth="2" />
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className="brand">
      <BrandMark />
      <span>
        <strong className={light ? "brand-name brand-name-light" : "brand-name"}>Swasthya</strong>
        <small>SMART INDIA HACKATHON</small>
      </span>
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="site-header">
        <Link to="/" aria-label="Swasthya home"><Brand /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/about" className="active">About</Link>
          <Link to="/role-selection" className="header-cta">Get started</Link>
        </nav>
      </header>

      <section className="about-hero">
        <div className="eyebrow">THE IDEA BEHIND SWASTHYA</div>
        <h1>Better conversations make<br /><em>better care</em>.</h1>
        <p>Swasthya helps patients share their story in the language and format that feels natural, then gives doctors a clear clinical starting point.</p>
      </section>

      <section className="about-content">
        <div className="about-statement">
          <span className="section-kicker">OUR PURPOSE</span>
          <h2>Less paperwork.<br />More presence.</h2>
        </div>
        <div className="about-copy">
          <p>Healthcare starts before the examination. A rushed symptom, a forgotten medicine, or a report buried in a folder can change the quality of a consultation.</p>
          <p>Swasthya is an assistive pre-consultation layer for Indian clinics. Voice, text, uploads, and guided questions become an organized case sheet, while the doctor remains in control of every decision.</p>
          <Link className="text-link" to="/role-selection">Explore the care experience <span aria-hidden="true">-&gt;</span></Link>
        </div>
      </section>

      <section className="about-values" aria-label="Swasthya principles">
        <article><span>01</span><h3>Human first</h3><p>Technology should make it easier to be heard, especially when time, language, or confidence gets in the way.</p></article>
        <article><span>02</span><h3>Clinically useful</h3><p>We organize information for real consultations, with clear context instead of opaque recommendations.</p></article>
        <article><span>03</span><h3>Built for India</h3><p>Multilingual input and accessible flows help care teams serve the people already walking through their doors.</p></article>
      </section>

      <footer className="site-footer">
        <Brand light />
        <div className="footer-bottom"><span>© 2026 Swasthya</span><Link to="/">Back to home <span aria-hidden="true">-&gt;</span></Link></div>
      </footer>
    </main>
  );
}
