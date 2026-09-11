import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

type IconProps = { size?: number; strokeWidth?: number };

const Icon = ({ children, size = 20, strokeWidth = 1.8 }: { children: ReactNode; size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const HomeIcon = ({ size = 20 }: IconProps) => <Icon size={size}><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></Icon>;
const PatientsIcon = ({ size = 20 }: IconProps) => <Icon size={size}><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0 1 14 0v2" /><path d="M16 4.5a4 4 0 0 1 0 5" /><path d="M19 14a5 5 0 0 1 3 4.5V21" /></Icon>;
const QueueIcon = ({ size = 20 }: IconProps) => <Icon size={size}><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></Icon>;
const CalendarIcon = ({ size = 20 }: IconProps) => <Icon size={size}><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4" /><path d="M8 2.5v4" /><path d="M3 9h18" /></Icon>;
const ReportsIcon = ({ size = 20 }: IconProps) => <Icon size={size}><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20V7" /></Icon>;
const LogoIcon = () => <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f9f94]"><span className="text-xl text-white">+</span></div>;

function CaseReview() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102349]">
      <Sidebar role="doctor" />

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0fa397]">
            <span className="text-[19px]">✚</span>
          </div>

          <div>
            <div className="text-[20px] font-extrabold leading-5">
              Swasthya
            </div>

            <div className="mt-1 text-[8px] font-bold tracking-[0.5px] text-[#0fa397]">
              SMART INDIA HACKATHON
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-7 flex flex-col gap-2 px-6">
              <button
                type="button"
                onClick={() => goTo("/doctor/dashboard")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <HomeIcon size={20} />
                <span className="text-[15px] font-bold">Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/patients")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <PatientsIcon size={20} />
                <span className="text-[15px] font-bold">Patients</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/queue")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <QueueIcon size={20} />
                <span className="text-[15px] font-bold">Queue</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/schedule")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <CalendarIcon size={20} />
                <span className="text-[15px] font-bold">Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/case-sheet")}
                className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"
              >
                <ReportsIcon size={20} />
                <span className="text-[15px] font-bold">Reports</span>
              </button>
        </nav>

        {/* Patient information */}
        <div className="mt-auto border-t border-[#31415e] px-6 pb-6 pt-5">
          <p className="text-[13px] font-bold text-white">
            Ananya Patel
          </p>

          <p className="mt-1 text-[11px] text-[#687994]">
            PID-2026-0892
          </p>
        </div>
      </aside>


      {/* ================= MAIN AREA ================= */}
            {/* MOBILE HEADER */}
      <div className="hidden">
        <div className="flex items-center gap-3">
          <LogoIcon />
          <div>
            <h1 className="text-[18px] font-extrabold text-white">Swasthya</h1>
            <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-[#0fa397]">
              Smart India Hackathon
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <QueueIcon size={23} />
        </button>
      </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#0d2147] px-5 pb-6 pt-6 shadow-2xl">
              <div className="flex items-center gap-3 px-1 pb-7">
                <LogoIcon />
                <div>
                  <h1 className="text-[19px] font-extrabold leading-none text-white">Swasthya</h1>
                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.09em] text-[#0fa59a]">
                    Smart India Hackathon
                  </p>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => goTo("/doctor/dashboard")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <HomeIcon size={20} />
                <span className="text-[15px] font-bold">Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/patients")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <PatientsIcon size={20} />
                <span className="text-[15px] font-bold">Patients</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/queue")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <QueueIcon size={20} />
                <span className="text-[15px] font-bold">Queue</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/schedule")}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <CalendarIcon size={20} />
                <span className="text-[15px] font-bold">Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => goTo("/doctor/case-sheet")}
                className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"
              >
                <ReportsIcon size={20} />
                <span className="text-[15px] font-bold">Reports</span>
              </button>
              </nav>

              <div className="mt-auto">
                <div className="mb-4 h-px bg-[#52627d]/50" />
                <p className="text-[14px] font-bold text-white">Dr. Rohan Sharma</p>
                <p className="mt-0.5 text-[11px] font-medium text-[#71819d]">MCI-2026-9485</p>
              </div>
            </aside>
          </div>
        )}

<main className="ml-0 min-h-screen lg:ml-[260px]">

        {/* Header */}
        <header className="flex h-[80px] items-center justify-between border-b border-[#dce3ed] bg-white px-4 sm:px-6 lg:px-10">

          <h1 className="text-[25px] font-extrabold tracking-[-0.5px]">
            AI Symptom Assistant
          </h1>

          <div className="flex items-center gap-4 sm:gap-8">

            {/* Search */}
            <div className="hidden h-[38px] w-[292px] items-center gap-3 rounded-[9px] bg-[#f6f8fb] px-4 text-[#71819a] md:flex">
              <span className="text-[18px]">⌕</span>

              <span className="text-[14px]">
                Search medical files, cases...
              </span>
            </div>

            {/* Notification */}
            <div className="relative text-[21px]">
              ♧

              <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#e53935] px-1 text-[9px] font-bold text-white">
                3
              </span>
            </div>

            <span className="hidden text-[14px] font-bold sm:block">
              Ananya Patel
            </span>

          </div>
        </header>


        {/* ================= CONTENT ================= */}
        <section className="px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">

          {/* Page Heading */}
          <div className="mb-7">

            <h2 className="text-[29px] font-extrabold tracking-[-0.8px]">
              Review Your Case
            </h2>

            <p className="mt-1 text-[16px] text-[#687b99]">
              Please verify all collected pre-consultation information below.
              Swasthya&apos;s AI has structured this sheet for your doctor.
            </p>

          </div>


          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">

            {/* ================= LEFT COLUMN ================= */}
            <div className="space-y-4">

              <CaseCard
                title="Personal Info"
                content="Ananya Patel, 24 Years, Female. Contact: +91 98765 43210. Language Preference: English & Gujarati."
              />

              <CaseCard
                title="Chief Complaint"
                content="Severe dry cough persisting for 3 weeks, accompanied by mild chest tightness when breathing deeply. No fever."
              />

              <CaseCard
                title="Symptoms Detailed"
                content="Pain location: Lower sternum, non-radiating. Triggers: Exertion, night time, dusty environments. Severity: 6/10."
              />

              <CaseCard
                title="Medical History"
                content="Mild childhood asthma (inactive for 10 years). No major surgeries. Family history of environmental dust allergies."
              />

              <CaseCard
                title="Active Medications"
                content="Over-the-counter cough syrup (Ascoril) taken occasionally. Multivitamins daily."
              />

              <CaseCard
                title="Uploaded Reports"
                content="Dr. Lal PathLabs Blood Report uploaded (Indicating slightly elevated Eosinophils: 8%)."
              />

            </div>


            {/* ================= RIGHT COLUMN ================= */}
            <div className="space-y-6">

              {/* Case Metadata */}
              <div className="rounded-[11px] border border-[#dce3ed] bg-white p-6">

                <h3 className="text-[18px] font-extrabold">
                  Case Metadata
                </h3>

                <div className="mt-5 space-y-4 text-[14px]">

                  <InfoRow
                    label="Patient Name:"
                    value="Ananya Patel"
                  />

                  <InfoRow
                    label="PID:"
                    value="PID-2026-0892"
                  />

                  <InfoRow
                    label="Date Started:"
                    value="Oct 26, 2026"
                  />

                  <div className="flex items-center justify-between">

                    <span className="text-[#6c7d98]">
                      Status:
                    </span>

                    <span className="rounded-[5px] bg-[#c9f6df] px-3 py-1 text-[11px] font-extrabold text-[#0baf79]">
                      READY (6/6)
                    </span>

                  </div>

                </div>
              </div>


              {/* Swasthya AI Insights */}
              <div className="rounded-[11px] border border-[#0fa397] bg-[#dff2fc] p-6">

                <div className="flex items-center gap-3">

                  <span className="text-[20px] text-[#0f9d92]">
                    ✣
                  </span>

                  <h3 className="text-[17px] font-extrabold">
                    Swasthya AI Insights
                  </h3>

                </div>

                <p className="mt-5 text-[13px] leading-[20px] text-[#172c50]">

                  <strong>Primary Observation:</strong>{" "}
                  Symptoms point towards persistent bronchial allergy or
                  dust-induced mild asthma exacerbation. Eosinophil elevation
                  (8%) supports this allergic etiology. Night-time coughing
                  spikes indicate trigger in home environment.

                </p>


                <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-[#71809a]">
                  Extracted Tags:
                </p>


                <div className="mt-2 flex flex-wrap gap-2">

                  <Tag text="Allergic Cough" />

                  <Tag text="No Fever" />

                  <Tag text="Elevated Eosinophils" />

                  <Tag text="Asthma History" />

                </div>


                <p className="mt-5 text-[11px] italic leading-[17px] text-[#71809a]">

                  Disclaimer: This summary was generated by AI and will be
                  reviewed by your doctor.

                </p>

              </div>


              {/* Submit / Draft */}
              <div className="space-y-3">

                <button onClick={() => navigate("/patient/dashboard")} className="flex h-[53px] w-full items-center justify-center rounded-[8px] bg-[#0f9d92] text-[15px] font-extrabold text-white transition hover:bg-[#0b8c82]">
                  Submit Case to Doctor
                </button>

                <button className="flex h-[53px] w-full items-center justify-center rounded-[8px] border border-[#dce3ed] bg-white text-[15px] font-bold text-[#687994] transition hover:bg-[#f7f9fc]">
                  Save as Draft
                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


/* ============================================================
   CASE CARD
============================================================ */

function CaseCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-[11px] border border-[#dce3ed] bg-white p-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          {/* Green Check */}
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9f6df] text-[14px] font-extrabold text-[#0caf7b]">
            ✓
          </span>

          <h3 className="text-[17px] font-extrabold">
            {title}
          </h3>

        </div>


        {/* Edit Button */}
        <button className="flex h-[30px] items-center gap-1 rounded-[6px] border border-[#0f9d92] px-3 text-[12px] font-bold text-[#0f9d92]">

          <span className="text-[12px]">
            ✎
          </span>

          Edit

        </button>

      </div>


      <p className="mt-4 text-[14px] leading-[21px] text-[#687b99]">
        {content}
      </p>

    </div>
  );
}


/* ============================================================
   INFORMATION ROW
============================================================ */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-[#6c7d98]">
        {label}
      </span>

      <span className="font-bold text-[#102349]">
        {value}
      </span>

    </div>
  );
}


/* ============================================================
   AI TAG
============================================================ */

function Tag({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-[4px] border border-[#d2e1ea] bg-white px-2 py-1 text-[10px] font-semibold text-[#0f9d92]">
      {text}
    </span>
  );
}


export default CaseReview;