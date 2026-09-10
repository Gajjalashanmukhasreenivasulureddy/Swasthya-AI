export {};
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type IconProps = {
  size?: number;
  strokeWidth?: number;
};

type NavItem = {
  label: string;
  icon: ReactNode;
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
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V19.6h-2v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7.6v-2h.24A1.7 1.7 0 0 0 9.4 10.94a1.7 1.7 0 0 0-.34-1.88L9 9l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V6.4h2v.02a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.78 9l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.02v2h-.02A1.7 1.7 0 0 0 19.4 15Z" />
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

const UsersStatIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 19c0-3.2 2.5-5 6-5s6 1.8 6 5" />
    <path d="M15 14.5c2.9.2 5 1.7 5 4.5" />
  </Icon>
);

const StethoscopeIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <path d="M6 3v5a6 6 0 0 0 12 0V3" />
    <path d="M4 3h4" />
    <path d="M16 3h4" />
    <path d="M12 14v2a4 4 0 0 0 8 0v-1" />
    <circle cx="20" cy="13" r="2" />
  </Icon>
);

const DocumentIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M14 3v5h5" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </Icon>
);

const CheckCircleIcon = ({ size = 25 }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </Icon>
);

const PlusIcon = ({ size = 19 }: IconProps) => (
  <Icon size={size}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

const ClipboardIcon = ({ size = 18 }: IconProps) => (
  <Icon size={size}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V2h6v2" />
    <path d="M9 10h6" />
    <path d="M9 14h4" />
  </Icon>
);

const ArrowRightIcon = ({ size = 16 }: IconProps) => (
  <Icon size={size}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
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
  badge,
  badgeClass,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  description: string;
  badge?: string;
  badgeClass?: string;
}) => {
  return (
    <div className="rounded-xl border border-[#dce4ef] bg-white p-5 shadow-[0_2px_8px_rgba(15,35,73,0.03)]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        {badge && (
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold ${badgeClass}`}
          >
            {badge}
          </span>
        )}
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
};

const StatusBadge = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => (
  <span
    className={`inline-flex min-w-[160px] items-center rounded-md px-3 py-1 text-[12px] font-bold ${className}`}
  >
    {children}
  </span>
);

function DoctorDashboard() {
  const navigate = useNavigate();
  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <HomeIcon size={20} />,
    },
    {
      label: "Patients",
      icon: <UsersIcon size={20} />,
    },
    {
      label: "Queue",
      icon: <QueueIcon size={20} />,
    },
    {
      label: "Schedule",
      icon: <CalendarIcon size={20} />,
    },
    {
      label: "Reports",
      icon: <ReportsIcon size={20} />,
    },
    {
      label: "Settings",
      icon: <SettingsIcon size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-[Outfit,sans-serif] text-[#102349]">
      <div className="flex min-h-screen">
        {/* ───────────────── SIDEBAR ───────────────── */}

        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#0d2147] lg:flex">
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
          <nav className="flex flex-col gap-1 px-6">
            {navItems.map((item, index) => {
              const active = index === 0;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    navigate(
                      {
                        Dashboard: "/doctor/dashboard",
                        Patients: "/doctor/patients",
                        Queue: "/doctor/queue",
                        Schedule: "/doctor/schedule",
                        Reports: "/doctor/case-sheet",
                        Settings: "/doctor/dashboard",
                      }[item.label] ?? "/doctor/dashboard",
                    )
                  }
                  className={`flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left transition ${
                    active
                      ? "bg-[#109f96] text-white"
                      : "text-[#71819d] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}

                  <span className="text-[15px] font-bold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Doctor profile */}
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

        {/* ───────────────── MOBILE SIDEBAR / TOP BAR ───────────────── */}

        <div className="fixed left-0 right-0 top-0 z-40 flex h-[70px] items-center justify-between border-b border-[#dce4ef] bg-[#0d2147] px-5 lg:hidden">
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

        {/* ───────────────── MAIN AREA ───────────────── */}

        <main className="min-w-0 flex-1 pt-[70px] lg:ml-[260px] lg:pt-0">
          {/* Top header */}
          <header className="flex h-[80px] items-center justify-between border-b border-[#dce4ef] bg-white px-6 sm:px-8 lg:px-10">
            <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-[#102349]">
              OPD Control Center
            </h2>

            <div className="flex items-center gap-5">
              {/* Search */}
              <div className="hidden h-[38px] w-[280px] items-center gap-2 rounded-lg bg-[#f7f9fc] px-4 md:flex">
                <SearchIcon size={18} />

                <input
                  type="text"
                  placeholder="Search patient or case id..."
                  className="w-full bg-transparent text-[14px] font-medium text-[#536886] outline-none placeholder:text-[#71819d]"
                />
              </div>

              {/* Notification */}
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

          {/* Dashboard content */}
          <section className="px-5 py-8 sm:px-8 lg:px-10">
            {/* Welcome */}
            <div>
              <h1 className="text-[31px] font-extrabold leading-tight tracking-[-0.025em] text-[#102349]">
                Welcome back, Dr. Sharma
              </h1>

              <p className="mt-1 text-[16px] font-medium text-[#667995]">
                Here is your clinical patient flow and AI automated pre-consult
                stats for today.
              </p>
            </div>

            {/* ───────────────── STATS ───────────────── */}

            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<UsersStatIcon size={25} />}
                iconBg="bg-[#e1f3fc]"
                iconColor="text-[#06a9a0]"
                label="Total Patients"
                value="248"
                description="Active in registry"
              />

              <StatCard
                icon={<StethoscopeIcon size={25} />}
                iconBg="bg-[#d6faf4]"
                iconColor="text-[#049f98]"
                label="Today's Queue"
                value="12"
                description="3 remaining to consult"
                badge="Live Flow"
                badgeClass="bg-[#c9f7ef] text-[#067f78]"
              />

              <StatCard
                icon={<DocumentIcon size={25} />}
                iconBg="bg-[#fff4ca]"
                iconColor="text-[#0aa099]"
                label="Pending Case Sheets"
                value="5"
                description="Requires doctor review"
                badge="Review Needed"
                badgeClass="bg-[#fff1c7] text-[#102349]"
              />

              <StatCard
                icon={<CheckCircleIcon size={25} />}
                iconBg="bg-[#d7f8e9]"
                iconColor="text-[#09a08f]"
                label="Completed Consults"
                value="7"
                description="Done this morning"
              />
            </div>

            {/* ───────────────── LOWER CONTENT ───────────────── */}

            <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
              {/* Queue card */}
              <div className="rounded-xl border border-[#dce4ef] bg-white p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Today's Consult Queue
                  </h2>

                  <button
                    type="button"
                    onClick={() => navigate("/doctor/queue")}
                    className="flex items-center gap-1 text-[13px] font-bold text-[#009c91] hover:text-[#007f77]"
                  >
                    View Full Queue
                    <ArrowRightIcon size={15} />
                  </button>
                </div>

                {/* Table */}
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[650px] border-collapse">
                    <thead>
                      <tr className="bg-[#f7f9fb]">
                        <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                          Patient Name
                        </th>

                        <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                          Time
                        </th>

                        <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                          Case Status
                        </th>

                        <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.02em] text-[#647590]">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Patient 1 */}
                      <tr className="border-b border-[#dce4ef]">
                        <td className="px-4 py-4 text-[13px] font-bold text-[#102349]">
                          Priya Mehta, 34F
                        </td>

                        <td className="px-4 py-4 text-[13px] font-medium text-[#667995]">
                          10:15 AM
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge className="bg-[#c9f7ef] text-[#00988d]">
                            New Case Sheet
                          </StatusBadge>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => navigate("/doctor/case-sheet")}
                            className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#142e5c]"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>

                      {/* Patient 2 */}
                      <tr className="border-b border-[#dce4ef]">
                        <td className="px-4 py-4 text-[13px] font-bold text-[#102349]">
                          Amit Patel, 45M
                        </td>

                        <td className="px-4 py-4 text-[13px] font-medium text-[#667995]">
                          10:30 AM
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge className="bg-[#e2f2fc] text-[#102349]">
                            Follow-up
                          </StatusBadge>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => navigate("/doctor/case-sheet")}
                            className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#142e5c]"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>

                      {/* Patient 3 */}
                      <tr className="border-b border-[#dce4ef]">
                        <td className="px-4 py-4 text-[13px] font-bold text-[#102349]">
                          Karan Singh, 61M
                        </td>

                        <td className="px-4 py-4 text-[13px] font-medium text-[#667995]">
                          11:00 AM
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge className="bg-[#fff1c7] text-[#df7a00]">
                            Pending Review
                          </StatusBadge>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => navigate("/doctor/case-sheet")}
                            className="rounded-md bg-[#0f9f94] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#0b8a81]"
                          >
                            Start Consult
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Recent activity */}
                <div className="mt-9">
                  <h3 className="text-[15px] font-extrabold text-[#102349]">
                    Recent Intake Activity
                  </h3>

                  <div className="mt-2 space-y-1.5 text-[12px] font-medium leading-relaxed text-[#6a7b98]">
                    <p>
                      • Rohan Sharma's Hindi voice consult translated,
                      structured sheet generated (2 min ago)
                    </p>

                    <p>
                      • Priya Mehta uploaded a new CBC Pathology report via PDF
                      (10 min ago)
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="h-fit rounded-xl border border-[#dce4ef] bg-white p-5 sm:p-6">
                <h2 className="text-[18px] font-extrabold text-[#102349]">
                  Quick Actions
                </h2>

                <div className="mt-4 space-y-3">
                  {/* Register patient */}
                  <button
                    type="button"
                    onClick={() => navigate("/doctor/patients")}
                    className="flex h-[42px] w-full items-center gap-3 rounded-lg bg-[#c8f7ee] px-3.5 text-left text-[13px] font-bold text-[#078d84] transition hover:bg-[#b8f1e6]"
                  >
                    <PlusIcon size={19} />
                    Register New Patient
                  </button>

                  {/* Schedule */}
                  <button
                    type="button"
                    onClick={() => navigate("/doctor/schedule")}
                    className="flex h-[42px] w-full items-center gap-3 rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-3.5 text-left text-[13px] font-bold text-[#102349] transition hover:bg-[#f1f5f9]"
                  >
                    <CalendarIcon size={18} />
                    View Weekly Schedule
                  </button>

                  {/* Pending cases */}
                  <button
                    type="button"
                    onClick={() => navigate("/doctor/case-sheet")}
                    className="flex h-[42px] w-full items-center gap-3 rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-3.5 text-left text-[13px] font-bold text-[#102349] transition hover:bg-[#f1f5f9]"
                  >
                    <ClipboardIcon size={18} />
                    Review 5 Pending Cases
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;