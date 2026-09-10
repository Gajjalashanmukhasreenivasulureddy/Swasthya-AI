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

const EditIcon = ({ size = 17 }: IconProps) => (
  <Icon size={size}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </Icon>
);

const UserCircleIcon = ({ size = 82 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 82 82"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="41" cy="41" r="38" stroke="#000000" strokeWidth="7" />
    <circle cx="41" cy="29" r="11" fill="#000000" />
    <path
      d="M17 66c2.5-13 11-19 24-19s21.5 6 24 19"
      fill="#000000"
    />
  </svg>
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

function PatientProfile() {
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

        {/* ───────────────── MOBILE HEADER ───────────────── */}

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

        {/* ───────────────── MAIN ───────────────── */}

        <main className="min-w-0 flex-1 pt-[70px] lg:ml-[260px] lg:pt-0">

          {/* HEADER */}

          <header className="flex h-[80px] items-center justify-between border-b border-[#dce4ef] bg-white px-6 sm:px-8 lg:px-10">

            <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-[#102349]">
              Patient Profile
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

          {/* CONTENT */}

          <section className="px-5 py-10 sm:px-8 lg:px-10">

            {/* ───────────────── PATIENT HEADER CARD ───────────────── */}

            <div className="rounded-xl border border-[#dce4ef] bg-white px-7 py-7">

              <div className="flex flex-col gap-6 xl:flex-row xl:items-center">

                {/* Profile Icon */}

                <div className="flex shrink-0 items-center justify-center">
                  <UserCircleIcon size={82} />
                </div>

                {/* Patient Details */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">

                    <div>

                      <h1 className="text-[29px] font-extrabold leading-tight text-[#102349]">
                        Priya Mehta
                      </h1>

                      <p className="mt-1 text-[14px] font-medium text-[#657795]">
                        Patient ID:{" "}
                        <span className="font-extrabold text-[#102349]">
                          P-2026-9843
                        </span>

                        <span className="mx-2 text-[#b5c0d0]">
                          |
                        </span>

                        Registered: Jan 10, 2026
                      </p>

                    </div>

                    {/* Buttons */}

                    <div className="flex gap-3">

                      <button
                        type="button"
                        className="flex h-[42px] items-center gap-2 rounded-lg border border-[#dce4ef] bg-white px-5 text-[13px] font-extrabold text-[#102349] transition hover:bg-[#f8fafc]"
                      >
                        <EditIcon size={16} />
                        Edit Profile
                      </button>

                      <button
                        type="button"
                        className="h-[42px] rounded-lg bg-[#109f96] px-5 text-[13px] font-extrabold text-white transition hover:bg-[#0b8d84]"
                      >
                        Start Consultation
                      </button>

                    </div>

                  </div>

                  <div className="my-3 h-px bg-[#dce4ef]" />

                  {/* Basic information */}

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        Age / Gender
                      </p>

                      <p className="mt-0.5 text-[14px] font-bold text-[#102349]">
                        34 Years / Female
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        Blood Group
                      </p>

                      <p className="mt-0.5 text-[14px] font-bold text-[#ef4444]">
                        A+ Positive
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        Contact Number
                      </p>

                      <p className="mt-0.5 text-[14px] font-bold text-[#102349]">
                        +91 98765 43210
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] font-medium text-[#71819d]">
                        ABHA ID
                      </p>

                      <p className="mt-0.5 text-[14px] font-bold text-[#009c91]">
                        mehta.priya@ndhm
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* ───────────────── TABS ───────────────── */}

            <div className="mt-6 border-b border-[#dce4ef]">

              <div className="flex gap-8 overflow-x-auto">

                <button
                  type="button"
                  className="relative pb-3 text-[14px] font-extrabold text-[#009c91]"
                >
                  Overview

                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#0f9f94]" />
                </button>

                <button
                  type="button"
                  className="pb-3 text-[14px] font-semibold text-[#637593] hover:text-[#102349]"
                >
                  Case History
                </button>

                <button
                  type="button"
                  className="pb-3 text-[14px] font-semibold text-[#637593] hover:text-[#102349]"
                >
                  Reports
                </button>

                <button
                  type="button"
                  className="pb-3 text-[14px] font-semibold text-[#637593] hover:text-[#102349]"
                >
                  Appointments
                </button>

              </div>
            </div>

            {/* ───────────────── LOWER SECTION ───────────────── */}

            <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">

              {/* LEFT */}

              <div className="space-y-6">

                {/* Clinical Summary */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Clinical &amp; Medical Summary
                  </h2>

                  {/* Chronic conditions */}

                  <div className="mt-5">

                    <p className="text-[12px] font-bold uppercase text-[#637593]">
                      Chronic Conditions
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-2">

                      <span className="rounded-md bg-[#fff1c7] px-3 py-1 text-[12px] font-bold text-[#e49a00]">
                        Mild Childhood Asthma
                      </span>

                      <span className="rounded-md bg-[#c9f7ef] px-3 py-1 text-[12px] font-bold text-[#009c91]">
                        Seasonal Dust Allergies
                      </span>

                    </div>
                  </div>

                  {/* Allergies */}

                  <div className="mt-5">

                    <p className="text-[12px] font-bold uppercase text-[#637593]">
                      Allergies &amp; Drug Reactions
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-2">

                      <span className="rounded-md bg-[#ffe0e0] px-3 py-1 text-[12px] font-bold text-[#ef4444]">
                        Penicillin (Anaphylaxis Risk)
                      </span>

                      <span className="rounded-md bg-[#fff1c7] px-3 py-1 text-[12px] font-bold text-[#df7a00]">
                        Sulfa Drugs (Moderate Rash)
                      </span>

                    </div>
                  </div>

                  {/* Medications */}

                  <div className="mt-5">

                    <p className="text-[12px] font-bold uppercase text-[#637593]">
                      Ongoing Medications
                    </p>

                    <p className="mt-1.5 text-[14px] font-medium text-[#102349]">
                      Montelukast 10mg (Once Daily - Night) | Cetirizine 10mg
                      (As needed for allergies)
                    </p>

                  </div>

                </div>

                {/* Recent Cases */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <div className="flex items-center justify-between">

                    <h2 className="text-[18px] font-extrabold text-[#102349]">
                      Recent Consultation Cases
                    </h2>

                    <button
                      type="button"
                      className="text-[13px] font-bold text-[#009c91]"
                    >
                      View All History
                    </button>

                  </div>

                  <div className="mt-4 space-y-4">

                    {/* Case 1 */}

                    <div className="flex flex-col gap-3 rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-[14px] font-extrabold text-[#102349]">
                          Dry Nocturnal Cough &amp; Throat Soreness
                        </p>

                        <p className="mt-1 text-[12px] font-medium text-[#71819d]">
                          Case ID: CSH-2026-0847 | Date: Jan 24, 2026
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className="rounded-md bg-[#d2f8e7] px-3 py-1 text-[12px] font-bold text-[#06ad7d]">
                          Completed
                        </span>

                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white"
                        >
                          View Sheet
                        </button>

                      </div>
                    </div>

                    {/* Case 2 */}

                    <div className="flex flex-col gap-3 rounded-lg border border-[#dce4ef] bg-[#f8fafc] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-[14px] font-extrabold text-[#102349]">
                          Acute Wheezing Post-Dust Exposure
                        </p>

                        <p className="mt-1 text-[12px] font-medium text-[#71819d]">
                          Case ID: CSH-2025-4120 | Date: Oct 12, 2025
                        </p>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className="rounded-md bg-[#d2f8e7] px-3 py-1 text-[12px] font-bold text-[#06ad7d]">
                          Completed
                        </span>

                        <button
                          type="button"
                          className="rounded-md bg-[#0d2147] px-4 py-2 text-[12px] font-bold text-white"
                        >
                          View Sheet
                        </button>

                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* RIGHT */}

              <div className="space-y-6">

                {/* Demographics */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Demographics &amp; Bio
                  </h2>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[13px] font-medium text-[#71819d]">
                        Email Address
                      </span>

                      <span className="text-right text-[13px] font-bold text-[#102349]">
                        priya.mehta@gmail.com
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[13px] font-medium text-[#71819d]">
                        Date of Birth
                      </span>

                      <span className="text-[13px] font-bold text-[#102349]">
                        14 Nov 1991
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[13px] font-medium text-[#71819d]">
                        Permanent Address
                      </span>

                      <span className="text-right text-[13px] font-bold text-[#102349]">
                        Greater Kailash II, New Delhi
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5">
                      <span className="text-[13px] font-medium text-[#71819d]">
                        Language Pref.
                      </span>

                      <span className="text-[13px] font-bold text-[#009c91]">
                        Hindi, English
                      </span>
                    </div>

                  </div>
                </div>

                {/* Upcoming Appointments */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Upcoming Appointments
                  </h2>

                  <div className="mt-4 rounded-lg bg-[#c9f7ef] p-4">

                    <div className="flex items-center gap-2">

                      <CalendarIcon
                        size={18}
                      />

                      <span className="text-[14px] font-extrabold text-[#009c91]">
                        OPD General Medicine
                      </span>

                    </div>

                    <p className="mt-2 text-[13px] font-medium text-[#102349]">
                      Tomorrow, Jan 25 at{" "}
                      <span className="font-extrabold">
                        10:15 AM
                      </span>{" "}
                      with Dr. Rohan Sharma
                    </p>

                  </div>

                </div>

                {/* Emergency Contact */}

                <div className="rounded-xl border border-[#dce4ef] bg-white p-6">

                  <h2 className="text-[18px] font-extrabold text-[#102349]">
                    Emergency Contact
                  </h2>

                  <div className="mt-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe0e0] text-[16px] font-extrabold text-[#ef4444]">
                      A
                    </div>

                    <div>
                      <p className="text-[14px] font-extrabold text-[#102349]">
                        Alok Mehta (Spouse)
                      </p>

                      <p className="text-[12px] font-medium text-[#71819d]">
                        +91 98112 00492 | GK-2 Delhi
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PatientProfile;