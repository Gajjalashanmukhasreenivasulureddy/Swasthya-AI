export {};
import { useState } from "react";

type IconName =
  | "user"
  | "mic"
  | "document"
  | "doctor"
  | "check"
  | "grid"
  | "shield"
  | "arrow"
  | "menu"
  | "close";

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20c.8-3.4 3.2-5 7-5s6.2 1.6 7 5" />
        </svg>
      );

    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0" />
          <path d="M12 18v3" />
          <path d="M9 21h6" />
        </svg>
      );

    case "document":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );

    case "doctor":
      return (
        <svg {...common}>
          <path d="M6 4h12v5a6 6 0 0 1-12 0z" />
          <path d="M12 15v6" />
          <path d="M9 21h6" />
          <path d="M12 6v5" />
          <path d="M9.5 8.5h5" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5-3.2 8.2-8 10-4.8-1.8-8-5-8-10V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    default:
      return null;
  }
}

const steps = [
  {
    number: "1",
    icon: "user" as IconName,
    title: "Patient Checks In",
    description:
      "Accesses Swasthya on mobile or clinic kiosk. Selects vernacular language preference.",
  },
  {
    number: "2",
    icon: "mic" as IconName,
    title: "AI Guided Intake",
    description:
      "Patient explains history via voice or text. Interactive touch map isolates exact symptom pain regions.",
  },
  {
    number: "3",
    icon: "document" as IconName,
    title: "AI Organizes Cases",
    description:
      "Platform processes medical jargon & uploaded files. Formats patient record into neat structured sections.",
  },
  {
    number: "4",
    icon: "doctor" as IconName,
    title: "Doctor Consults",
    description:
      "Doctor opens structured case sheet directly in EMR. No tedious typing required, saving up to 10 mins per visit.",
  },
];

const capabilities = [
  {
    icon: "mic" as IconName,
    title: "Multilingual Voice Input",
    description:
      "Patients explain conditions in Hindi, Tamil, Telugu, Bengali, Marathi, or English. Swasthya translates & normalizes terms instantly.",
    blue: true,
  },
  {
    icon: "check" as IconName,
    title: "Adaptive Questionnaire",
    description:
      "Intelligent follow-up questions drill down into duration, severity, and prior episodes dynamically based on the patient’s answers.",
    blue: false,
  },
  {
    icon: "document" as IconName,
    title: "Smart Report OCR Extractor",
    description:
      "Upload old PDFs, prescription scans, or blood tests. Swasthya scans relevant parameters and plots them inside chronological trends.",
    blue: false,
  },
  {
    icon: "grid" as IconName,
    title: "Clean Clinical Case Sheets",
    description:
      "Outputs medical histories into structured sections (HPI, Past History, Active Meds, Allergies) adhering to global standard formats.",
    blue: true,
  },
];

const doctorPoints = [
  "Adheres to standardized WHO/clinical terminology",
  "Integrates seamlessly with existing OPD systems & EMRs",
  "Highlights warning flags automatically (like anaphylactic risk)",
];

const patientPoints = [
  "Complete vernacular support across 12+ Indian languages",
  "Simple tap-based pain maps for elder care accessibility",
  "Consolidates and visualizes scattered paper physical records",
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f9f93] text-white">
        <Icon name="document" size={17} strokeWidth={2.2} />
      </div>

      <div className="leading-none">
        <div className="text-[18px] font-extrabold tracking-[-0.04em] text-[#102349]">
          Swasthya
        </div>
        <div className="mt-0.5 text-[6px] font-bold tracking-[0.12em] text-[#0f9f93]">
          SMART INDIA HACKATHON
        </div>
      </div>
    </div>
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#c9f7ee] px-3.5 py-1 text-[9px] font-bold tracking-[0.08em] text-[#07998e]">
      {children}
    </span>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-[11px] leading-5 text-white/80"
        >
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#11c9a8]">
            <Icon name="check" size={15} strokeWidth={2.2} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CaseSheetPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[535px]">
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_18px_50px_rgba(15,35,73,0.09)]">
        <div className="flex items-center justify-between border-b border-[#e8edf3] pb-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6d63]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffb51b]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#24b34b]" />
          </div>

          <span className="rounded-md bg-[#d4faec] px-2.5 py-1 text-[8px] font-semibold text-[#07998e]">
            AI Structured Case Sheet #2940
          </span>
        </div>

        <div className="border-b border-[#e8edf3] py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[12px] font-bold text-[#102349]">
                Rohan Sharma, 34M
              </h3>
              <p className="mt-1 text-[8px] text-[#6d7e9a]">
                Primary Complaint: Chronic cough & dry throat for 3 weeks
              </p>
            </div>

            <span className="whitespace-nowrap text-[8px] font-semibold text-[#07998e]">
              Lang: Hindi (Auto Translated)
            </span>
          </div>
        </div>

        <div className="pt-3">
          <p className="text-[8px] font-bold text-[#213558]">
            Synthesized Symptoms (From Voice Input)
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "Dry Cough",
              "No Fever",
              "Slight Dyspnea on Exertion",
              "Throat irritation",
            ].map((symptom) => (
              <span
                key={symptom}
                className="rounded border border-[#e0e6ee] bg-[#f8fafc] px-2 py-1 text-[7px] text-[#5e6f8b]"
              >
                {symptom}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[8px] font-bold text-[#213558]">
            Extracted PDF Insights
          </p>

          <div className="mt-2 flex items-start gap-2 rounded-lg bg-[#cef8e7] p-2.5">
            <div className="mt-0.5 text-[#0ba58f]">
              <Icon name="document" size={15} />
            </div>

            <div>
              <p className="text-[8px] font-bold text-[#24405c]">
                CBC Report (Dr. Lal PathLabs)
              </p>
              <p className="mt-1 text-[7px] leading-3 text-[#52706d]">
                Eosinophils slightly elevated 8% - indicative of mild allergy
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-[#e4eaf0] bg-[#f8fafc] p-3">
            <p className="text-[7px] font-bold text-[#70819a]">
              GENERATED CLINICAL SUMMARY
            </p>
            <p className="mt-1.5 text-[7px] leading-3.5 text-[#64748b]">
              Patient voice records describe dry nocturnal cough with
              progressive worsening over 21 days. Denies chills, sputum, or
              recent travel. Elevated eosinophil count from attached lab sheet
              corroborates allergic etiology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main className="min-h-screen bg-white font-sans text-[#102349]">
      {/* =========================================================
          NAVBAR
      ========================================================== */}
      <header className="sticky top-0 z-50 border-b border-[#edf1f5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[70px] max-w-[1140px] items-center justify-between px-5 lg:px-0">
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="cursor-pointer"
          >
            <Logo />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollToSection("home")}
              className="text-[11px] font-semibold text-[#07998e]"
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-[11px] font-medium text-[#71809a] transition hover:text-[#07998e]"
            >
              How It Works
            </button>

            <button
              onClick={() => scrollToSection("for-doctors")}
              className="text-[11px] font-medium text-[#71809a] transition hover:text-[#07998e]"
            >
              For Doctors
            </button>

            <button
              onClick={() => scrollToSection("for-patients")}
              className="text-[11px] font-medium text-[#71809a] transition hover:text-[#07998e]"
            >
              For Patients
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="text-[11px] font-medium text-[#71809a] transition hover:text-[#07998e]"
            >
              About
            </button>
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <button
              onClick={() => scrollToSection("role-selection")}
              className="text-[11px] font-semibold text-[#102349] transition hover:text-[#07998e]"
            >
              Login
            </button>

            <button
              onClick={() => scrollToSection("role-selection")}
              className="rounded-lg bg-[#0b998e] px-5 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#07877e]"
            >
              Get Started
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="flex text-[#102349] md:hidden"
            aria-label="Toggle menu"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#edf1f5] bg-white px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              {[
                ["Home", "home"],
                ["How It Works", "how-it-works"],
                ["For Doctors", "for-doctors"],
                ["For Patients", "for-patients"],
                ["About", "about"],
                ["Get Started", "role-selection"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-left text-sm font-medium text-[#51637f]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section
        id="home"
        className="bg-[#f7fafd] px-5 py-14 sm:py-16 lg:px-0 lg:py-[88px]"
      >
        <div className="mx-auto grid max-w-[1140px] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionBadge>AI-ASSISTED PRE-CONSULTATION</SectionBadge>

            <h1 className="mt-6 max-w-[570px] text-[42px] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#102349] sm:text-[50px]">
              Smarter Case Taking
              <br />
              <span className="text-[#0c9c91]">Better Healthcare</span>
            </h1>

            <p className="mt-6 max-w-[555px] text-[14px] leading-7 text-[#70819b]">
              Swasthya securely gathers medical history prior to patient
              consults using voice, text, report uploads, and touch-optimized
              symptom maps. AI structures the noise into high-fidelity clinic
              sheets, so doctors can focus purely on the examination.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => scrollToSection("role-selection")}
                className="flex items-center gap-2 rounded-lg bg-[#0b9b90] px-6 py-3 text-[10px] font-bold text-white shadow-sm transition hover:bg-[#07877e]"
              >
                Start Free Case-Taking
                <Icon name="arrow" size={14} strokeWidth={2.2} />
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="rounded-lg border border-[#dfe6ee] bg-white px-6 py-3 text-[10px] font-bold text-[#243754] transition hover:border-[#0b9b90] hover:text-[#0b9b90]"
              >
                Watch How It Works
              </button>
            </div>

            <div className="mt-7 flex max-w-[555px] items-start gap-3 rounded-lg bg-[#def3ff] px-4 py-3">
              <div className="mt-0.5 shrink-0 text-[#19385c]">
                <Icon name="shield" size={15} strokeWidth={2} />
              </div>

              <p className="text-[8px] font-medium leading-3.5 text-[#2b4561]">
                <span className="font-bold">Note on Medical Safety:</span>{" "}
                Swasthya is strictly assistive. It organizes diagnostic inputs
                and patient histories, leaving 100% of final clinical diagnosis
                and medication to certified medical professionals.
              </p>
            </div>
          </div>

          <div className="lg:pl-3">
            <CaseSheetPreview />
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section
        id="how-it-works"
        className="bg-white px-5 py-16 sm:py-20 lg:px-0 lg:py-[82px]"
      >
        <div className="mx-auto max-w-[1140px]">
          <div className="text-center">
            <SectionBadge>SEAMLESS PATIENT INTAKE</SectionBadge>

            <h2 className="mt-5 text-[29px] font-extrabold tracking-[-0.035em] text-[#102349] sm:text-[34px]">
              How Swasthya Streamlines Clinic Care
            </h2>

            <p className="mx-auto mt-3 max-w-[650px] text-[12px] text-[#8290a6]">
              A frictionless ecosystem transforming patient preparation before
              they step into the doctor&apos;s chamber.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-xl border border-[#e3e9f0] bg-[#f9fbfd] p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(15,35,73,0.07)]"
              >
                <div className="absolute right-5 top-5 text-[24px] font-extrabold text-[#e3eaf1]">
                  {step.number}
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9f8ee] text-[#07998e]">
                  <Icon name={step.icon} size={17} />
                </div>

                <h3 className="mt-4 text-[12px] font-bold text-[#102349]">
                  {step.title}
                </h3>

                <p className="mt-3 text-[9px] leading-4.5 text-[#7b8ba3]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CAPABILITIES
      ========================================================== */}
      <section
        id="about"
        className="bg-[#f7fafd] px-5 py-16 sm:py-20 lg:px-0 lg:py-[82px]"
      >
        <div className="mx-auto max-w-[1140px]">
          <div className="text-center">
            <SectionBadge>KEY CAPABILITIES</SectionBadge>

            <h2 className="mt-5 text-[29px] font-extrabold tracking-[-0.035em] text-[#102349] sm:text-[34px]">
              Powerful AI to Support Clinic Intake
            </h2>

            <p className="mx-auto mt-3 max-w-[650px] text-[12px] text-[#8290a6]">
              Four pillars designed to collect clean history inputs across
              diverse tech literacy barriers.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="flex items-start gap-4 rounded-xl border border-[#e2e8ef] bg-white p-6 shadow-[0_5px_20px_rgba(15,35,73,0.04)]"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    capability.blue
                      ? "bg-[#dff2ff] text-[#089e98]"
                      : "bg-[#d5f9eb] text-[#07998e]"
                  }`}
                >
                  <Icon name={capability.icon} size={20} />
                </div>

                <div>
                  <h3 className="text-[12px] font-bold text-[#102349]">
                    {capability.title}
                  </h3>

                  <p className="mt-2 text-[9px] leading-5 text-[#7a8ba3]">
                    {capability.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          DOCTORS + PATIENTS
      ========================================================== */}
      <section className="bg-[#0c2047] px-5 py-16 sm:py-20 lg:px-0 lg:py-[82px]">
        <div className="mx-auto grid max-w-[1140px] gap-14 md:grid-cols-2 md:gap-20">
          <div id="for-doctors">
            <p className="text-[9px] font-bold tracking-[0.08em] text-[#0ab3a4]">
              FOR DOCTORS
            </p>

            <h2 className="mt-5 max-w-[430px] text-[24px] font-extrabold leading-[1.25] tracking-[-0.025em] text-white">
              Reduce EHR Overload & Focus on Patients
            </h2>

            <p className="mt-5 max-w-[520px] text-[11px] leading-5.5 text-white/70">
              Doctors waste hours manually entering symptomatic context.
              Swasthya formats medical history in clear, standard summaries
              before the consultation begins, saving up to 40% of consultation
              overhead.
            </p>

            <CheckList items={doctorPoints} />
          </div>

          <div id="for-patients">
            <p className="text-[9px] font-bold tracking-[0.08em] text-[#0ab3a4]">
              FOR PATIENTS
            </p>

            <h2 className="mt-5 max-w-[430px] text-[24px] font-extrabold leading-[1.25] tracking-[-0.025em] text-white">
              Your Voice, Fully Understood
            </h2>

            <p className="mt-5 max-w-[520px] text-[11px] leading-5.5 text-white/70">
              Explaining symptoms is stressful under high clinic volumes. Our
              platform empowers you to calmly express medical details in your
              native language, ensuring nothing is missed during your consult.
            </p>

            <CheckList items={patientPoints} />
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================== */}
      <section className="bg-[#f7fafd] px-5 py-16 sm:py-20 lg:px-0 lg:py-[80px]">
        <div className="mx-auto max-w-[1140px]">
          <div className="text-center">
            <SectionBadge>SIH SANDBOX TESTING</SectionBadge>

            <h2 className="mt-5 text-[29px] font-extrabold tracking-[-0.035em] text-[#102349] sm:text-[34px]">
              Praising the New Paradigm of Clinic Intake
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#e1e8ef] bg-white p-6 shadow-[0_6px_20px_rgba(15,35,73,0.05)]">
              <p className="text-[11px] italic leading-5.5 text-[#77869c]">
                &quot;The voice symptom collection is a lifesaver. My elderly
                patients can now explain their breathing troubles in Hindi.
                The output structured sheet tells me exactly what I need to
                know immediately.&quot;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d2f8ed] text-[10px] font-bold text-[#07998e]">
                  D
                </div>

                <div>
                  <p className="text-[9px] font-bold text-[#1d3152]">
                    Dr. Anirban Sen
                  </p>
                  <p className="mt-0.5 text-[7px] text-[#8290a5]">
                    Head of Medicine, Central Delhi Clinic
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#e1e8ef] bg-white p-6 shadow-[0_6px_20px_rgba(15,35,73,0.05)]">
              <p className="text-[11px] italic leading-5.5 text-[#77869c]">
                &quot;I uploaded three years of old handwritten reports and
                diabetes charts. Swasthya cleanly pulled the prior HbA1c values
                and compiled it. The doctor was surprised that I was prepared
                so fast.&quot;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d2f8ed] text-[10px] font-bold text-[#07998e]">
                  M
                </div>

                <div>
                  <p className="text-[9px] font-bold text-[#1d3152]">
                    Meera Deshmukh
                  </p>
                  <p className="mt-0.5 text-[7px] text-[#8290a5]">
                    Patient diagnosed with Type-2 Diabetes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="bg-[#0c2047] px-5 pt-14 lg:px-0 lg:pt-[68px]">
        <div className="mx-auto max-w-[1140px]">
          <div className="grid gap-10 md:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]">
            <div>
              <Logo />

              <p className="mt-5 max-w-[300px] text-[9px] leading-4.5 text-white/70">
                Secure, AI-assisted clinic pre-consultation engine.
                <br />
                Optimizing workflows for Indian healthcare settings.
              </p>
            </div>

            {[
              {
                title: "FOR DOCTORS",
                links: ["Overview", "APIs & Integration", "Privacy Standards"],
              },
              {
                title: "FOR PATIENTS",
                links: ["Overview", "APIs & Integration", "Privacy Standards"],
              },
              {
                title: "DEVELOPERS",
                links: ["Overview", "APIs & Integration", "Privacy Standards"],
              },
              {
                title: "SIH 2026",
                links: ["Overview", "APIs & Integration", "Privacy Standards"],
              },
            ].map((column) => (
              <div key={column.title}>
                <p className="text-[8px] font-bold tracking-[0.05em] text-[#08b09f]">
                  {column.title}
                </p>

                <div className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <button
                      key={link}
                      className="block text-[8px] text-white/70 transition hover:text-white"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/15 py-5 text-[7px] text-white/60 sm:flex-row">
            <p>© 2026 Swasthya SIH Hackathon Project. All rights reserved.</p>

            <p>Complies with NDHM & ABDM health data standards.</p>
          </div>
        </div>
      </footer>

      {/* =========================================================
          ROLE SELECTION PLACEHOLDER
          This ID allows Get Started / Login navigation to work now.
      ========================================================== */}
      <div id="role-selection" className="hidden" />
    </main>
  );
}