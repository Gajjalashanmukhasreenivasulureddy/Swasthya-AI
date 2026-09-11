export {};
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

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

const PatientsIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <circle cx="9" cy="7" r="4" />
    <path d="M2 21v-2a7 7 0 0 1 14 0v2" />
    <path d="M16 4.5a4 4 0 0 1 0 5" />
    <path d="M19 14a5 5 0 0 1 3 4.5V21" />
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

function PatientQueue() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };


  return (
    <div className="min-h-screen bg-[#f6f8fb] font-[Outfit,sans-serif] text-[#102349]">
      <Sidebar role="doctor" />
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden">

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
                className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"
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
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
              >
                <ReportsIcon size={20} />
                <span className="text-[15px] font-bold">Reports</span>
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

        <div className="hidden">

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
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-white transition hover:bg-white/10"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <QueueIcon size={23} />
          </button>

        </div>

        {/* MAIN */}

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
                className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"
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
                className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
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

<main className="min-w-0 flex-1 pt-[70px] lg:ml-[260px] lg:pt-0">

          {/* HEADER */}

          <header className="flex h-[80px] items-center justify-between border-b border-[#dce4ef] bg-white px-6 sm:px-8 lg:px-10">

            <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-[#102349]">
              Patient Queue
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

            {/* PAGE TITLE */}

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-[31px] font-extrabold leading-tight text-[#102349]">
                    Today's Queue
                  </h1>

                  <span className="rounded-full bg-[#c9f7ef] px-3 py-1 text-[12px] font-extrabold text-[#009c91]">
                    18 Patients
                  </span>

                </div>

                <p className="mt-1 text-[16px] font-medium text-[#687b99]">
                  Manage active clinical intake flow and verify pre-consult
                  patient sheets.
                </p>

              </div>

              <p className="pt-3 text-[14px] font-extrabold text-[#009c91] sm:text-right">
                Date: January 26, 2026
              </p>

            </div>

            {/* STAT CARDS */}

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {/* TOTAL QUEUE */}

              <div className="flex min-h-[108px] items-center gap-5 rounded-xl border border-[#dce4ef] bg-white px-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#dcefff] text-[#102349]">

                  <span className="text-[17px] font-bold">
                    O
                  </span>

                </div>

                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wide text-[#657795]">
                    Total Queue
                  </p>

                  <p className="mt-1 text-[31px] font-extrabold leading-none text-[#102349]">
                    18
                  </p>
                </div>

              </div>

              {/* WAITING */}

              <div className="flex min-h-[108px] items-center gap-5 rounded-xl border border-[#dce4ef] bg-white px-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff1c6] text-[#df7a00]">

                  <span className="text-[17px] font-bold">
                    O
                  </span>

                </div>

                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wide text-[#657795]">
                    Waiting
                  </p>

                  <p className="mt-1 text-[31px] font-extrabold leading-none text-[#102349]">
                    2
                  </p>
                </div>

              </div>

              {/* IN PROGRESS */}

              <div className="flex min-h-[108px] items-center gap-5 rounded-xl border border-[#dce4ef] bg-white px-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#dce9ff] text-[#3980ff]">

                  <span className="text-[17px] font-bold">
                    O
                  </span>

                </div>

                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wide text-[#657795]">
                    In Progress
                  </p>

                  <p className="mt-1 text-[31px] font-extrabold leading-none text-[#102349]">
                    0
                  </p>
                </div>

              </div>

              {/* COMPLETED */}

              <div className="flex min-h-[108px] items-center gap-5 rounded-xl border border-[#dce4ef] bg-white px-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#d3f8e7] text-[#08af80]">

                  <span className="text-[17px] font-bold">
                    O
                  </span>

                </div>

                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wide text-[#657795]">
                    Completed
                  </p>

                  <p className="mt-1 text-[31px] font-extrabold leading-none text-[#102349]">
                    0
                  </p>
                </div>

              </div>

            </div>

            {/* QUEUE TABLE */}

            <div className="mt-8 rounded-xl border border-[#dce4ef] bg-white p-6">

              {/* FILTER TABS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  className="rounded-md bg-[#109f96] px-4 py-2 text-[12px] font-extrabold text-white"
                >
                  All Patients
                </button>

                <button
                  type="button"
                  className="rounded-md bg-[#f5f7fa] px-4 py-2 text-[12px] font-bold text-[#657795] transition hover:bg-[#edf1f6]"
                >
                  Waiting (7)
                </button>

                <button
                  type="button"
                  className="rounded-md bg-[#f5f7fa] px-4 py-2 text-[12px] font-bold text-[#657795] transition hover:bg-[#edf1f6]"
                >
                  In Consultation (3)
                </button>

                <button
                  type="button"
                  className="rounded-md bg-[#f5f7fa] px-4 py-2 text-[12px] font-bold text-[#657795] transition hover:bg-[#edf1f6]"
                >
                  Completed (8)
                </button>

              </div>

              {/* TABLE */}

              <div className="mt-5 overflow-x-auto">

                <table className="w-full min-w-[950px] border-collapse">

                  <thead>

                    <tr className="bg-[#f6f8fb]">

                      <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase text-[#657795]">
                        Q No
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase text-[#657795]">
                        Patient
                      </th>

                      <th className="px-4 py-3 text-center text-[12px] font-extrabold uppercase text-[#657795]">
                        App. Time
                      </th>

                      <th className="px-4 py-3 text-center text-[12px] font-extrabold uppercase text-[#657795]">
                        Wait Time
                      </th>

                      <th className="px-4 py-3 text-center text-[12px] font-extrabold uppercase text-[#657795]">
                        Case Type
                      </th>

                      <th className="px-4 py-3 text-center text-[12px] font-extrabold uppercase text-[#657795]">
                        Priority
                      </th>

                      <th className="px-4 py-3 text-center text-[12px] font-extrabold uppercase text-[#657795]">
                        Status
                      </th>

                      <th className="px-4 py-3 text-center text-[12px] font-extrabold uppercase text-[#657795]">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {/* PATIENT 1 */}

                    <tr className="border-b border-[#dce4ef]">

                      <td className="px-4 py-4">
                        <p className="text-[18px] font-extrabold text-[#102349]">
                          01
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-[13px] font-bold text-[#102349]">
                          Priya Mehta, 34F
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <p className="text-[13px] font-medium text-[#657795]">
                          10:15 AM
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <p className="text-[13px] font-medium text-[#657795]">
                          12 mins
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">

                        <span className="inline-flex rounded-md bg-[#c9f7ef] px-3 py-1.5 text-[12px] font-bold text-[#009c91]">
                          New AI Case Sheet
                        </span>

                      </td>

                      <td className="px-4 py-4 text-center">

                        <span className="inline-flex rounded-md bg-[#f3f5f8] px-3 py-1.5 text-[12px] font-bold text-[#657795]">
                          Normal
                        </span>

                      </td>

                      <td className="px-4 py-4 text-center">

                        <span className="inline-flex rounded-md bg-[#fff1c6] px-3 py-1.5 text-[12px] font-bold text-[#df7a00]">
                          Waiting
                        </span>

                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#172f5d]"
                        >
                          View
                        </button>
                      </td>

                    </tr>

                    {/* PATIENT 2 */}

                    <tr>

                      <td className="px-4 py-4">
                        <p className="text-[18px] font-extrabold text-[#102349]">
                          02
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-[13px] font-bold text-[#102349]">
                          Amit Patel, 45M
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <p className="text-[13px] font-medium text-[#657795]">
                          10:30 AM
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <p className="text-[13px] font-medium text-[#657795]">
                          25 mins
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center">

                        <span className="inline-flex rounded-md bg-[#dce9ff] px-3 py-1.5 text-[12px] font-bold text-[#3980ff]">
                          Follow-up
                        </span>

                      </td>

                      <td className="px-4 py-4 text-center">

                        <span className="inline-flex rounded-md bg-[#ffe0e0] px-3 py-1.5 text-[12px] font-bold text-[#ef4444]">
                          Urgent
                        </span>

                      </td>

                      <td className="px-4 py-4 text-center">

                        <span className="inline-flex rounded-md bg-[#fff1c6] px-3 py-1.5 text-[12px] font-bold text-[#df7a00]">
                          Waiting
                        </span>

                      </td>

                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#172f5d]"
                        >
                          View
                        </button>
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </section>

        </main>

      </div>
    </div>
  );
}

export default PatientQueue;