export {};
import type { ReactNode } from "react";

type IconProps = {
  size?: number;
  strokeWidth?: number;
};

const Icon = ({
  children,
  size = 20,
  strokeWidth = 1.8,
}: {
  children: ReactNode;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

/* ───────────────── ICONS ───────────────── */

const HomeIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </Icon>
);

const UsersIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

const QueueIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </Icon>
);

const CalendarIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <rect x="3" y="4.5" width="18" height="17" rx="2" />
    <path d="M16 2.5v4" />
    <path d="M8 2.5v4" />
    <path d="M3 9h18" />
  </Icon>
);

const ReportsIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20V7" />
  </Icon>
);

const SettingsIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6.4v-2.5H6.5a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.6 1Z" />
  </Icon>
);

const SearchIcon = ({ size = 19 }: IconProps) => (
  <Icon size={size}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
);

const BellIcon = ({ size = 21 }: IconProps) => (
  <Icon size={size}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21h4" />
  </Icon>
);

const ShieldIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);

const FileIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </Icon>
);

/* ───────────────── LOGO ───────────────── */

const LogoIcon = () => (
  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f9f94]">
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M5 17.5h14M6 17.5v-7h12v7M8 10.5V7h8v3.5M3.5 17.5v2h17v-2M9 14h2M13 14h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 8.5V5.5M16 7h3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

/* ───────────────── PAGE ───────────────── */

function AICaseSheet() {
  return (
    <div className="min-h-screen bg-[#fbfdfc] font-[DM_Sans,sans-serif] text-[#16302d]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#0d2147] lg:flex">

          <div className="flex items-center gap-3 px-6 pb-7 pt-6">
            <LogoIcon />

            <div>
              <h1 className="text-[19px] font-extrabold leading-none text-white">
                Swasthya
              </h1>

              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.09em] text-[#0fa59a]">
                Smart India Hackathon
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-6">

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <HomeIcon size={20} />
              <span className="text-[15px] font-bold">
                Dashboard
              </span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"
            >
              <UsersIcon size={20} />
              <span className="text-[15px] font-bold">
                Patients
              </span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <QueueIcon size={20} />
              <span className="text-[15px] font-bold">
                Queue
              </span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <CalendarIcon size={20} />
              <span className="text-[15px] font-bold">
                Schedule
              </span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <ReportsIcon size={20} />
              <span className="text-[15px] font-bold">
                Reports
              </span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <SettingsIcon size={20} />
              <span className="text-[15px] font-bold">
                Settings
              </span>
            </button>

          </nav>

          <div className="mt-auto px-6 pb-6">
            <div className="mb-4 h-px bg-[#52627d]/50" />

            <p className="text-[14px] font-bold text-white">
              Dr. Rohan Sharma
            </p>

            <p className="mt-0.5 text-[11px] font-medium text-[#71819d]">
              MCI-2026-9485
            </p>
          </div>
        </aside>

        {/* MOBILE HEADER */}

        <div className="fixed left-0 right-0 top-0 z-40 flex h-[70px] items-center justify-between bg-[#0d2147] px-5 lg:hidden">

          <div className="flex items-center gap-3">
            <LogoIcon />

            <div>
              <h1 className="text-[18px] font-extrabold text-white">
                Swasthya
              </h1>

              <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-[#0fa59a]">
                Smart India Hackathon
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-white"
            aria-label="Open menu"
          >
            <QueueIcon size={23} />
          </button>

        </div>

        {/* MAIN */}

        <main className="min-w-0 flex-1 pt-[70px] lg:ml-[260px] lg:pt-0">

          {/* HEADER */}

          <header className="flex h-[80px] items-center justify-between border-b border-[#dce4ef] bg-white px-6 sm:px-8 lg:px-10">

            <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-[#102349]">
              AI Case Analyzer
            </h2>

            <div className="flex items-center gap-5">

              <div className="hidden h-[38px] w-[280px] items-center gap-2 rounded-lg bg-[#f7f9fc] px-4 md:flex">

                <SearchIcon size={18} />

                <input
                  type="text"
                  placeholder="Search patient or case id..."
                  className="w-full bg-transparent text-[14px] font-medium text-[#536886] outline-none placeholder:text-[#71819d]"
                />

              </div>

              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center text-[#102349]"
                aria-label="Notifications"
              >
                <BellIcon size={20} />

                <span className="absolute right-0.5 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white">
                  3
                </span>
              </button>

              <p className="hidden text-[14px] font-extrabold text-[#102349] sm:block">
                Dr. Sharma
              </p>

            </div>
          </header>

          {/* CONTENT */}

          <section className="px-5 py-10 sm:px-8 lg:px-10">

            {/* PATIENT TITLE */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-[29px] font-extrabold leading-tight text-[#102349]">
                  Priya Mehta, 34F
                </h1>

                <span className="rounded-md bg-[#c9f7ef] px-3 py-1 text-[12px] font-extrabold text-[#009c91]">
                  AI-Generated
                </span>

              </div>

              <p className="text-[13px] font-medium text-[#657795]">
                Case ID:{" "}
                <span className="font-extrabold text-[#102349]">
                  CSH-2026-0847
                </span>

                <span className="mx-1.5 text-[#b5c0d0]">
                  |
                </span>

                Date: Jan 24, 2026
              </p>

            </div>

            {/* AI WARNING */}

            <div className="mt-6 flex items-center gap-3 rounded-lg border border-[#f59e0b] bg-[#fff4c9] px-4 py-4 text-[#df7a00]">

              <ShieldIcon size={20} />

              <p className="text-[14px] font-bold">
                AI-Assisted Case Sheet: Please review and verify all medical
                data sections prior to clinical EMR commit.
              </p>

            </div>

            {/* GRID */}

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">

              {/* LEFT COLUMN */}

              <div className="space-y-6">

                {/* PATIENT INFORMATION */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Patient Information
                  </h2>

                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        DOB
                      </p>

                      <p className="mt-0.5 text-[13px] font-bold text-[#102349]">
                        14 Nov 1991
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        Blood Group
                      </p>

                      <p className="mt-0.5 text-[13px] font-bold text-[#102349]">
                        O+ Positive
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        Contact No
                      </p>

                      <p className="mt-0.5 text-[13px] font-bold text-[#102349]">
                        +91 98765 43210
                      </p>
                    </div>

                  </div>

                </div>

                {/* CHIEF COMPLAINT */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Chief Complaint
                  </h2>

                  <p className="mt-4 text-[14px] font-medium leading-6 text-[#263754]">
                    Patient describes persistent chest congestion, throat
                    irritation, and dry nighttime cough for past 3 weeks.
                    Symptoms flare up particularly in dusty environments.
                    No productive sputum or chills noted.
                  </p>

                  <div className="mt-5">

                    <p className="text-[12px] font-medium text-[#71819d]">
                      Symptom Pain Scale: Moderate-Severe
                    </p>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e0e6ef]">
                      <div className="h-full w-[48%] bg-[#df7a00]" />
                    </div>

                  </div>

                </div>

                {/* AI SYMPTOMS */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    AI Synthesized Symptoms
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-md border border-[#ff4b4b] bg-[#fff0f0] px-3 py-1.5 text-[12px] font-bold text-[#ef4444]">
                      Severe Dry Cough
                    </span>

                    <span className="rounded-md border border-[#f59e0b] bg-[#fff5df] px-3 py-1.5 text-[12px] font-bold text-[#df7a00]">
                      Throat Irritation
                    </span>

                    <span className="rounded-md border border-[#0f9f94] bg-[#e1faf6] px-3 py-1.5 text-[12px] font-bold text-[#009c91]">
                      No Fever
                    </span>

                  </div>

                </div>

                {/* MEDICAL HISTORY */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Medical History
                  </h2>

                  <div className="mt-4 space-y-2 text-[14px] font-medium text-[#263754]">

                    <p>
                      <span className="font-extrabold text-[#102349]">
                        Past Diagnoses:
                      </span>{" "}
                      Mild Childhood Asthma (inactive since age 12)
                    </p>

                    <p>
                      <span className="font-extrabold text-[#102349]">
                        Prior Surgeries:
                      </span>{" "}
                      Appendectomy (2018)
                    </p>

                    <p>
                      <span className="font-extrabold text-[#102349]">
                        Family History:
                      </span>{" "}
                      Maternal history of Type-2 Diabetes
                    </p>

                  </div>

                </div>

              </div>

              {/* RIGHT COLUMN */}

              <div className="space-y-6">

                {/* ALLERGIES */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Allergies
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-md bg-[#ffe0e0] px-3 py-1.5 text-[12px] font-bold text-[#ef4444]">
                      Penicillin (Anaphylactic Risk)
                    </span>

                    <span className="rounded-md bg-[#fff0c7] px-3 py-1.5 text-[12px] font-bold text-[#df7a00]">
                      Dust Mites (Moderate)
                    </span>

                  </div>

                </div>

                {/* CURRENT MEDICATIONS */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Current Medications
                  </h2>

                  <div className="mt-4 space-y-2">

                    <div className="flex items-center justify-between gap-4">

                      <p className="text-[13px] font-bold text-[#102349]">
                        Cetirizine 10mg
                      </p>

                      <p className="text-[12px] font-medium text-[#657795]">
                        Once Daily (HS)
                      </p>

                    </div>

                    <div className="flex items-center justify-between gap-4">

                      <p className="text-[13px] font-bold text-[#102349]">
                        Montelukast 10mg
                      </p>

                      <p className="text-right text-[12px] font-medium text-[#657795]">
                        HS (For asthma cover)
                      </p>

                    </div>

                  </div>

                </div>

                {/* UPLOADED REPORTS */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Uploaded Medical Reports
                  </h2>

                  <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#d0f8e4] px-3 py-3">

                    <div className="text-[#08af80]">
                      <FileIcon size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[13px] font-extrabold text-[#102349]">
                        CBC Lab Report.pdf
                      </p>

                      <p className="mt-0.5 text-[11px] font-medium text-[#71819d]">
                        Eosinophils slightly elevated (8%)
                      </p>

                    </div>

                  </div>

                </div>

                {/* AI ANALYTICS */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    AI Extraction Analytics
                  </h2>

                  <p className="mt-4 text-[12px] font-medium text-[#71819d]">
                    Extraction Confidence Score: 87%
                  </p>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e0e6ef]">

                    <div className="h-full w-[87%] bg-[#0f9f94]" />

                  </div>

                  <div className="mt-4 rounded-lg border border-[#f59e0b] bg-[#fff4c9] p-3">

                    <p className="text-[11px] font-extrabold uppercase text-[#df7a00]">
                      Missing Gaps Detected
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#263754]">
                      • Patient did not specify prior smoking history.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* BOTTOM ACTION BAR */}

            <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-[#dce4ef] bg-white p-6 md:flex-row md:items-center">

              {/* LEFT ACTIONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  className="h-[42px] rounded-lg border border-[#dce4ef] bg-white px-6 text-[13px] font-extrabold text-[#102349] transition hover:bg-[#f8fafc]"
                >
                  Edit Info
                </button>

                <button
                  type="button"
                  className="h-[42px] rounded-lg border border-[#ff5757] bg-[#ffe1e1] px-6 text-[13px] font-extrabold text-[#ef4444] transition hover:bg-[#ffd6d6]"
                >
                  Flag for Review
                </button>

              </div>

              {/* RIGHT ACTIONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  className="h-[42px] rounded-lg border border-[#0f9f94] bg-white px-6 text-[13px] font-extrabold text-[#009c91] transition hover:bg-[#e9fbf8]"
                >
                  Request More Info
                </button>

                <button
                  type="button"
                  className="h-[42px] rounded-lg bg-[#109f96] px-6 text-[13px] font-extrabold text-white transition hover:bg-[#0b8d84]"
                >
                  Approve &amp; Start Consult
                </button>

              </div>

            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

export default AICaseSheet;