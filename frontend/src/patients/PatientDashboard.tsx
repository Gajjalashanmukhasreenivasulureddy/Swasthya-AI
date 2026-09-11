export {};
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

const HomeIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </Icon>
);

const PlusIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
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

const RecordsIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M14 3v5h5" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </Icon>
);

const UploadIcon = ({ size = 20 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M5 20h14" />
  </svg>
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

const CheckCircleIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </Icon>
);

const ActivityIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <path d="M4 19V9" />
    <path d="M10 19V5" />
    <path d="M16 19v-8" />
    <path d="M22 19V7" />
  </Icon>
);

const StatCalendarIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <rect x="3" y="4.5" width="18" height="17" rx="2" />
    <path d="M16 2.5v4" />
    <path d="M8 2.5v4" />
    <path d="M3 9h18" />
  </Icon>
);

const DocumentStatIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M14 3v5h5" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </Icon>
);

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

const StatCard = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  description: string;
}) => (
  <div className="rounded-xl border border-[#dce4ef] bg-white p-5 shadow-[0_2px_8px_rgba(15,35,73,0.03)]">
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
    >
      {icon}
    </div>

    <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.02em] text-[#617391]">
      {label}
    </p>

    <p className="mt-1 text-[34px] font-extrabold leading-none text-[#102349]">
      {value}
    </p>

    <p className="mt-2 text-[12px] font-medium text-[#6c7e9b]">
      {description}
    </p>
  </div>
);

function PatientDashboard() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-[Outfit,sans-serif] text-[#102349]">
      <Sidebar role="patient" />
      <div className="flex min-h-screen">
        {/* SIDEBAR */}

        <aside className="hidden">
          {/* Logo */}
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

          {/* Navigation */}
                    <nav className="flex flex-col gap-1">
            <button type="button" onClick={() => goTo("/patient/dashboard")} className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"><HomeIcon size={20} /><span className="text-[15px] font-bold">Dashboard</span></button>
            <button type="button" onClick={() => goTo("/patient/case-taking")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><PlusIcon size={20} /><span className="text-[15px] font-bold">New Case</span></button>
            <button type="button" onClick={() => goTo("/patient/case-review")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><CalendarIcon size={20} /><span className="text-[15px] font-bold">Appointments</span></button>
            <button type="button" onClick={() => goTo("/patient/medical-records")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><RecordsIcon size={20} /><span className="text-[15px] font-bold">Medical Records</span></button>
            <button type="button" onClick={() => goTo("/patient/upload-reports")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><UploadIcon size={20} /><span className="text-[15px] font-bold">Upload Reports</span></button>
          </nav>

          {/* Patient profile */}
          <div className="mt-auto px-6 pb-6">
            <div className="mb-4 h-px bg-[#52627d]/50" />

            <p className="text-[14px] font-bold text-white">Ananya Patel</p>

            <p className="mt-0.5 text-[11px] font-medium text-[#71819d]">
              PID-2026-0892
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
            className="rounded-lg p-2 text-white"
            aria-label="Open menu"
          >
            <PlusIcon size={23} />
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="hidden">
            <button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/40" />
            <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#0d2147] px-5 pb-6 pt-6 shadow-2xl">
              <div className="flex items-center gap-3 px-1 pb-7"><LogoIcon /><div><h1 className="text-[19px] font-extrabold leading-none text-white">Swasthya</h1><p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.09em] text-[#0fa59a]">Smart India Hackathon</p></div></div>
              <nav className="flex flex-col gap-1">
            <button type="button" onClick={() => goTo("/patient/dashboard")} className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"><HomeIcon size={20} /><span className="text-[15px] font-bold">Dashboard</span></button>
            <button type="button" onClick={() => goTo("/patient/case-taking")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><PlusIcon size={20} /><span className="text-[15px] font-bold">New Case</span></button>
            <button type="button" onClick={() => goTo("/patient/case-review")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><CalendarIcon size={20} /><span className="text-[15px] font-bold">Appointments</span></button>
            <button type="button" onClick={() => goTo("/patient/medical-records")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><RecordsIcon size={20} /><span className="text-[15px] font-bold">Medical Records</span></button>
            <button type="button" onClick={() => goTo("/patient/upload-reports")} className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"><UploadIcon size={20} /><span className="text-[15px] font-bold">Upload Reports</span></button>
              </nav>
              <div className="mt-auto"><div className="mb-4 h-px bg-[#52627d]/50" /><p className="text-[14px] font-bold text-white">Ananya Patel</p><p className="mt-0.5 text-[11px] font-medium text-[#71819d]">PID-2026-0892</p></div>
            </aside>
          </div>
        )}

        {/* MAIN CONTENT */}

        <main className="min-w-0 flex-1 pt-[70px] lg:ml-[260px] lg:pt-0">
          {/* HEADER */}

          <header className="flex h-[76px] items-center justify-between border-b border-[#dce4ef] bg-white px-6 sm:px-8 lg:px-10">
            <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-[#102349]">
              Patient Health Center
            </h2>

            <div className="flex items-center gap-5">
              {/* Search */}
              <div className="hidden h-[38px] w-[270px] items-center gap-2 rounded-lg bg-[#f7f9fc] px-4 md:flex">
                <SearchIcon size={18} />

                <input
                  type="text"
                  placeholder="Search medical files, cases..."
                  className="w-full bg-transparent text-[14px] font-medium text-[#536886] outline-none placeholder:text-[#71819d]"
                />
              </div>

              {/* Notifications */}
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
                Ananya Patel
              </p>
            </div>
          </header>

          {/* DASHBOARD */}

          <section className="px-5 py-8 sm:px-8 lg:px-10">
            {/* Welcome */}

            <div>
              <h1 className="text-[31px] font-extrabold leading-tight tracking-[-0.025em] text-[#102349]">
                Welcome back, Ananya
              </h1>

              <p className="mt-1 text-[16px] font-medium text-[#667995]">
                Track your diagnostic symptom records, upload files, or prepare
                clinical context sheets for upcoming physician consults.
              </p>
            </div>

            {/* STATS */}

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<CheckCircleIcon size={25} />}
                iconBg="bg-[#d5faf2]"
                iconColor="text-[#05a095]"
                label="Active Cases"
                value="2"
                description="1 newly submitted"
              />

              <StatCard
                icon={<StatCalendarIcon size={25} />}
                iconBg="bg-[#e0f1fc]"
                iconColor="text-[#087da9]"
                label="Upcoming Visits"
                value="1"
                description="Tomorrow, 10:30 AM"
              />

              <StatCard
                icon={<ActivityIcon size={25} />}
                iconBg="bg-[#d8f9e9]"
                iconColor="text-[#08a277]"
                label="Medical Records"
                value="8"
                description="All verified PDFs"
              />

              <StatCard
                icon={<DocumentStatIcon size={25} />}
                iconBg="bg-[#fff3cd]"
                iconColor="text-[#eea000]"
                label="Pending Lab Reports"
                value="3"
                description="Awaiting clinic sync"
              />
            </div>

            {/* QUICK ACTIONS + NEXT APPOINTMENT */}

            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_368px]">
              {/* Quick Actions */}

              <div className="rounded-xl border border-[#dce4ef] bg-white p-5 sm:p-6">
                <h2 className="text-[18px] font-extrabold text-[#102349]">
                  Quick Actions
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Start New Case */}

                  <button
                    type="button"
                    onClick={() => goTo("/patient/case-taking")}
                    className="min-h-[79px] rounded-lg bg-[#109f96] px-5 py-4 text-left text-white transition hover:bg-[#0b8d84]"
                  >
                    <p className="text-[15px] font-extrabold">
                      Start New Case
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-white/90">
                      Brief AI-assisted symptom intake
                    </p>
                  </button>

                  {/* Upload Reports */}

                  <button
                    type="button"
                    onClick={() => goTo("/patient/upload-reports")}
                    className="min-h-[79px] rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-5 py-4 text-left transition hover:bg-[#f1f5f9]"
                  >
                    <p className="text-[15px] font-extrabold text-[#102349]">
                      Upload Lab Reports
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#71819d]">
                      Scan reports and prescriptions
                    </p>
                  </button>

                  {/* Appointments */}

                  <button
                    type="button"
                    className="min-h-[79px] rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-5 py-4 text-left transition hover:bg-[#f1f5f9]"
                  >
                    <p className="text-[15px] font-extrabold text-[#102349]">
                      View Appointments
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#71819d]">
                      Schedule or reschedule consults
                    </p>
                  </button>

                  {/* Profile */}

                  <button
                    type="button"
                    className="min-h-[79px] rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-5 py-4 text-left transition hover:bg-[#f1f5f9]"
                  >
                    <p className="text-[15px] font-extrabold text-[#102349]">
                      Update Health Profile
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#71819d]">
                      Chronological allergies &amp; history
                    </p>
                  </button>
                </div>
              </div>

              {/* Next Appointment */}

              <div className="rounded-xl border border-[#dce4ef] bg-white p-5 sm:p-6">
                <h2 className="text-[18px] font-extrabold leading-[1.1] text-[#102349]">
                  Next Appointment
                </h2>

                <p className="text-[16px] font-extrabold text-[#102349]">
                  Dr. Rohan Sharma
                </p>

                <p className="text-[13px] font-medium text-[#71819d]">
                  Pulmonology &amp; Medicine
                </p>

                <div className="mt-4 rounded-lg border border-[#dce4ef] bg-[#f7f9fb] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.02em] text-[#71819d]">
                    Schedule Info
                  </p>

                  <p className="mt-1 text-[13px] font-extrabold text-[#102349]">
                    Tomorrow, Oct 27 at 10:30 AM
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#71819d]">
                    Room 402 • Out-Patient Department
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#d2f8e7] px-3 py-3 text-[12px] font-bold text-[#069b7e]">
                  <CheckCircleIcon size={19} />
                  <span>Symptom Case Sheet Synced</span>
                </div>

                <button
                  type="button"
                  className="mt-3 h-[44px] w-full rounded-lg bg-[#109f96] text-[13px] font-extrabold text-white transition hover:bg-[#0b8d84]"
                >
                  Modify Pre-Consult Sheet
                </button>
              </div>
            </div>

            {/* CASE SHEETS */}

            <div className="mt-8 rounded-xl border border-[#dce4ef] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-extrabold text-[#102349]">
                  My Pre-Consultation Case Sheets
                </h2>

                <button
                  type="button"
                  className="text-[13px] font-bold text-[#009c91] hover:text-[#007f77]"
                >
                  View All
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="bg-[#f7f9fb]">
                      <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                        Case ID
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                        Symptom Focus
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                        Submitted
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Case 1 */}

                    <tr className="border-b border-[#dce4ef]">
                      <td className="px-4 py-4 text-[13px] font-extrabold text-[#102349]">
                        CAS-9284
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#102349]">
                        Chronic migraine headaches &amp; nausea
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#71819d]">
                        Oct 24, 2026
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex min-w-[152px] justify-center rounded-md bg-[#e0f1fc] px-3 py-1 text-[12px] font-bold text-[#087da9]">
                          Submitted
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#142e5c]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>

                    {/* Case 2 */}

                    <tr className="border-b border-[#dce4ef]">
                      <td className="px-4 py-4 text-[13px] font-extrabold text-[#102349]">
                        CAS-8193
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#102349]">
                        Dry cough &amp; morning breathlessness
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#71819d]">
                        Oct 18, 2026
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex min-w-[152px] justify-center rounded-md bg-[#fff1c7] px-3 py-1 text-[12px] font-bold text-[#df7a00]">
                          Under Review
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#142e5c]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>

                    {/* Case 3 */}

                    <tr className="border-b border-[#dce4ef]">
                      <td className="px-4 py-4 text-[13px] font-extrabold text-[#102349]">
                        CAS-7402
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#102349]">
                        Left ankle swelling (Sports Injury)
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#71819d]">
                        Sep 30, 2026
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex min-w-[152px] justify-center rounded-md bg-[#c9f7ef] px-3 py-1 text-[12px] font-bold text-[#00988d]">
                          Consultation Scheduled
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#142e5c]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>

                    {/* Case 4 */}

                    <tr>
                      <td className="px-4 py-4 text-[13px] font-extrabold text-[#102349]">
                        CAS-6932
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#102349]">
                        Annual physical general pre-intake
                      </td>

                      <td className="px-4 py-4 text-[13px] font-medium text-[#71819d]">
                        Sep 12, 2026
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex min-w-[152px] justify-center rounded-md bg-[#d2f8e7] px-3 py-1 text-[12px] font-bold text-[#069b7e]">
                          Completed
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#142e5c]"
                        >
                          View Details
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

export default PatientDashboard;