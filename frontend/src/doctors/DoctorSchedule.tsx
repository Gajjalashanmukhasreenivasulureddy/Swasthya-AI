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

const PlusIcon = ({ size = 21 }: IconProps) => (
  <Icon size={size}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
);

const ChevronLeftIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

const ChevronRightIcon = ({ size = 20 }: IconProps) => (
  <Icon size={size}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

const LocationIcon = ({ size = 15 }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="10" r="3" />
    <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
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

/* ───────────────── APPOINTMENT CARD ───────────────── */

const AppointmentCard = ({
  time,
  type,
  patient,
  typeClass,
}: {
  time: string;
  type: string;
  patient: string;
  typeClass: string;
}) => (
  <div className="rounded-xl border border-[#dce4ef] bg-[#f8fafc] p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-[13px] font-extrabold text-[#657795]">{time}</p>

      <span
        className={`rounded-md px-2 py-1 text-[10px] font-extrabold ${typeClass}`}
      >
        {type}
      </span>
    </div>

    <p className="mt-3 text-[16px] font-extrabold text-[#102349]">
      {patient}
    </p>

    <div className="mt-2 flex items-center gap-2 text-[#71819d]">
      <LocationIcon size={13} />

      <span className="text-[12px] font-medium">Consultation</span>
    </div>
  </div>
);

/* ───────────────── PAGE ───────────────── */

function DoctorSchedule() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] font-[Outfit,sans-serif] text-[#102349]">
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
              <span className="text-[15px] font-bold">Dashboard</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <PatientsIcon size={20} />
              <span className="text-[15px] font-bold">Patients</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <QueueIcon size={20} />
              <span className="text-[15px] font-bold">Queue</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg bg-[#109f96] px-4 text-left text-white"
            >
              <CalendarIcon size={20} />
              <span className="text-[15px] font-bold">Schedule</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <ReportsIcon size={20} />
              <span className="text-[15px] font-bold">Reports</span>
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[#71819d] transition hover:bg-white/5 hover:text-white"
            >
              <SettingsIcon size={20} />
              <span className="text-[15px] font-bold">Settings</span>
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

        <main className="min-w-0 flex-1 lg:ml-[260px]">

          {/* TOP HEADER */}

          <header className="flex h-[80px] items-center justify-between border-b border-[#dce4ef] bg-white px-6 sm:px-8 lg:px-10">

            <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-[#102349]">
              Doctor Schedule
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

          {/* PAGE BODY */}

          <div className="flex flex-col xl:flex-row">

            {/* CALENDAR AREA */}

            <section className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:px-10">

              {/* MONTH + CONTROLS */}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <h1 className="text-[24px] font-extrabold text-[#102349]">
                    January 2026
                  </h1>

                  <button
                    type="button"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[#dce4ef] bg-white text-[#102349] transition hover:bg-[#f5f7fa]"
                    aria-label="Previous week"
                  >
                    <ChevronLeftIcon size={19} />
                  </button>

                  <button
                    type="button"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-md border border-[#dce4ef] bg-white text-[#102349] transition hover:bg-[#f5f7fa]"
                    aria-label="Next week"
                  >
                    <ChevronRightIcon size={19} />
                  </button>

                </div>

                {/* VIEW SWITCHER */}

                <div className="flex h-[39px] items-center rounded-lg border border-[#dce4ef] bg-white p-1">

                  <button
                    type="button"
                    className="h-[31px] rounded-md px-4 text-[12px] font-bold text-[#657795]"
                  >
                    Day
                  </button>

                  <button
                    type="button"
                    className="h-[31px] rounded-md bg-[#109f96] px-4 text-[12px] font-extrabold text-white"
                  >
                    Week
                  </button>

                  <button
                    type="button"
                    className="h-[31px] rounded-md px-4 text-[12px] font-bold text-[#657795]"
                  >
                    Month
                  </button>

                </div>

              </div>

              {/* CALENDAR */}

              <div className="mt-6 overflow-hidden rounded-xl border border-[#dce4ef] bg-white">

                {/* DAYS HEADER */}

                <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))] border-b border-[#dce4ef]">

                  <div className="h-[98px] border-r border-[#dce4ef] bg-[#f8fafc]" />

                  <div className="flex h-[98px] flex-col items-center justify-center border-r border-[#dce4ef]">
                    <span className="text-[12px] font-extrabold uppercase text-[#0f9f94]">
                      MON
                    </span>
                    <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#109f96] text-[12px] font-extrabold text-white">
                      26
                    </span>
                  </div>

                  <div className="flex h-[98px] flex-col items-center justify-center border-r border-[#dce4ef]">
                    <span className="text-[12px] font-bold uppercase text-[#657795]">
                      TUE
                    </span>
                    <span className="mt-2 text-[12px] font-extrabold text-[#102349]">
                      27
                    </span>
                  </div>

                  <div className="flex h-[98px] flex-col items-center justify-center border-r border-[#dce4ef]">
                    <span className="text-[12px] font-bold uppercase text-[#657795]">
                      WED
                    </span>
                    <span className="mt-2 text-[12px] font-extrabold text-[#102349]">
                      28
                    </span>
                  </div>

                  <div className="flex h-[98px] flex-col items-center justify-center border-r border-[#dce4ef]">
                    <span className="text-[12px] font-bold uppercase text-[#657795]">
                      THU
                    </span>
                    <span className="mt-2 text-[12px] font-extrabold text-[#102349]">
                      29
                    </span>
                  </div>

                  <div className="flex h-[98px] flex-col items-center justify-center border-r border-[#dce4ef]">
                    <span className="text-[12px] font-bold uppercase text-[#657795]">
                      FRI
                    </span>
                    <span className="mt-2 text-[12px] font-extrabold text-[#102349]">
                      30
                    </span>
                  </div>

                  <div className="flex h-[98px] flex-col items-center justify-center">
                    <span className="text-[12px] font-bold uppercase text-[#657795]">
                      SAT
                    </span>
                    <span className="mt-2 text-[12px] font-extrabold text-[#102349]">
                      31
                    </span>
                  </div>

                </div>

                {/* TIME GRID */}

                <div className="overflow-x-auto">

                  <div className="min-w-[700px]">

                    {/* 08:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          08:00 AM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px] border-b border-[#dce4ef]" />

                    </div>

                    {/* 09:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          09:00 AM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px] border-b border-[#dce4ef]" />

                    </div>

                    {/* 10:00 + PRIYA */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[60px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          10:00 AM
                        </span>
                      </div>

                      <div className="relative col-span-6 h-[60px] border-b border-[#dce4ef] bg-[#c9f7ef]">

                        <div className="absolute inset-y-0 left-0 w-1 bg-[#109f96]" />

                        <div className="px-3 pt-3">

                          <p className="text-[13px] font-extrabold text-[#102349]">
                            Priya Mehta
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium text-[#657795]">
                              10:15 AM - 10:45 AM (30 mins)
                            </span>

                            <span className="text-[11px] font-extrabold text-[#009c91]">
                              New AI Case Sheet
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* 11:00 + AMIT */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[60px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          11:00 AM
                        </span>
                      </div>

                      <div className="relative col-span-6 h-[60px] border-b border-[#dce4ef] bg-[#dce9ff]">

                        <div className="absolute inset-y-0 left-0 w-1 bg-[#3980ff]" />

                        <div className="px-3 pt-3">

                          <p className="text-[13px] font-extrabold text-[#102349]">
                            Amit Patel
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium text-[#657795]">
                              11:00 AM - 11:30 AM (30 mins)
                            </span>

                            <span className="text-[11px] font-extrabold text-[#3980ff]">
                              Follow-up
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* 12:00 + KARAN */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[60px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          12:00 PM
                        </span>
                      </div>

                      <div className="relative col-span-6 h-[60px] border-b border-[#dce4ef] bg-[#fff1c6]">

                        <div className="absolute inset-y-0 left-0 w-1 bg-[#df7a00]" />

                        <div className="px-3 pt-3">

                          <p className="text-[13px] font-extrabold text-[#102349]">
                            Karan Singh
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium text-[#657795]">
                              12:00 PM - 01:00 PM (60 mins)
                            </span>

                            <span className="text-[11px] font-extrabold text-[#df7a00]">
                              General Consult
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* 01:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          01:00 PM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px] border-b border-[#dce4ef]" />

                    </div>

                    {/* 02:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          02:00 PM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px] border-b border-[#dce4ef]" />

                    </div>

                    {/* 03:00 + ROHAN */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[60px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          03:00 PM
                        </span>
                      </div>

                      <div className="relative col-span-6 h-[60px] border-b border-[#dce4ef] bg-[#d3f8e7]">

                        <div className="absolute inset-y-0 left-0 w-1 bg-[#0fba87]" />

                        <div className="px-3 pt-3">

                          <p className="text-[13px] font-extrabold text-[#102349]">
                            Rohan Sharma
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-medium text-[#657795]">
                              03:30 PM - 04:00 PM (30 mins)
                            </span>

                            <span className="text-[11px] font-extrabold text-[#0fba87]">
                              Case Analyzer
                            </span>
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* 04:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          04:00 PM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px] border-b border-[#dce4ef]" />

                    </div>

                    {/* 05:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-b border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795]">
                          05:00 PM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px] border-b border-[#dce4ef]" />

                    </div>

                    {/* 06:00 */}

                    <div className="grid grid-cols-[100px_repeat(6,minmax(100px,1fr))]">

                      <div className="flex h-[64px] items-start justify-center border-r border-[#dce4ef] pt-6">
                        <span className="text-[12px] font-medium text-[#657795] pt-0">
                          06:00 PM
                        </span>
                      </div>

                      <div className="col-span-6 h-[64px]" />

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* RIGHT APPOINTMENTS PANEL */}

            <aside className="w-full border-t border-[#dce4ef] bg-white px-6 py-8 xl:w-[360px] xl:border-l xl:border-t-0 xl:px-8">

              <button
                type="button"
                className="flex h-[43px] w-full items-center justify-center gap-2 rounded-lg bg-[#109f96] text-[14px] font-extrabold text-white transition hover:bg-[#0d9188]"
              >
                <PlusIcon size={20} />
                Add Appointment
              </button>

              <div className="mt-5">

                <h2 className="text-[18px] font-extrabold text-[#102349]">
                  Today, Jan 26
                </h2>

                <p className="mt-1 text-[13px] font-medium text-[#657795]">
                  4 Appointments Scheduled
                </p>

              </div>

              <div className="mt-7 space-y-5">

                <AppointmentCard
                  time="10:15 AM - 10:45 AM"
                  type="New AI Case Sheet"
                  patient="Priya Mehta"
                  typeClass="bg-[#c9f7ef] text-[#009c91]"
                />

                <AppointmentCard
                  time="11:00 AM - 11:30 AM"
                  type="Follow-up"
                  patient="Amit Patel"
                  typeClass="bg-[#dce9ff] text-[#3980ff]"
                />

                <AppointmentCard
                  time="12:00 PM - 01:00 PM"
                  type="General Consult"
                  patient="Karan Singh"
                  typeClass="bg-[#fff1c6] text-[#df7a00]"
                />

                <AppointmentCard
                  time="03:30 PM - 04:00 PM"
                  type="Case Analyzer"
                  patient="Rohan Sharma"
                  typeClass="bg-[#d3f8e7] text-[#0fba87]"
                />

              </div>

              {/* UPCOMING */}

              <div className="mt-8 rounded-xl bg-[#c9f7ef] p-5">

                <p className="text-[12px] font-extrabold uppercase tracking-wide text-[#009c91]">
                  Upcoming Tomorrow
                </p>

                <p className="mt-3 text-[13px] font-bold leading-snug text-[#102349]">
                  Clinic Intake Setup: 8 patients already pre-filled reports
                  via AI Assistant.
                </p>

              </div>

            </aside>

          </div>

        </main>

      </div>
    </div>
  );
}

export default DoctorSchedule;