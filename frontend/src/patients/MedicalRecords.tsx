export {};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientRecords } from "../services/api";
const Icon = ({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M14 14h7" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-2v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.6 15a1.7 1.7 0 0 0-1.55-1H8v-2h.05A1.7 1.7 0 0 0 9.6 11a1.7 1.7 0 0 0-.34-1.88L9.2 9.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1-1.55V6h2v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 11a1.7 1.7 0 0 0 1.55 1H21v2h-.05a1.7 1.7 0 0 0-1.55 1Z" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    default:
      return null;
  }
};

const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button type="button" onClick={onClick}
      className={`flex h-[43px] items-center gap-4 rounded-lg px-4 text-[15px] font-semibold ${
        active
          ? "bg-[#119c91] text-white"
          : "text-[#71819f]"
      }`}
    >
      <Icon name={icon} size={20} />
      <span>{label}</span>
    </button>
  );
};

const MedicalRecordCard = ({
  title,
  subtitle,
  expanded = false,
}: {
  title: string;
  subtitle: string;
  expanded?: boolean;
}) => {
  return (
    <div
      className={`rounded-2xl border bg-white px-7 py-6 ${
        expanded
          ? "border-2 border-[#119c91]"
          : "border-[#dce3ed]"
      }`}
    >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e1f5ff] text-[#0aa89d]">
            <Icon name="file" size={22} />
          </div>

          <div>
            <h3 className="text-[18px] font-extrabold text-[#102349]">
              {title}
            </h3>

            <p className="mt-1 text-[14px] text-[#71819f]">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-9 rounded-lg border border-[#dce3ed] bg-white px-4 text-[13px] font-bold text-[#647692]">
            Download PDF
          </button>

          <button className="h-9 rounded-lg bg-[#071a42] px-4 text-[13px] font-bold text-white">
            View Full Record
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 border-t border-[#dce3ed] pt-5">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.75fr]">
            <div className="rounded-xl bg-[#f7f9fb] px-5 py-5">
              <h4 className="text-[15px] font-extrabold text-[#102349]">
                Active Rx (Prescribed Medications)
              </h4>

              <div className="mt-4">
                <p className="text-[14px] font-bold text-[#102349]">
                  1. Tab. Montelukast + Levocetirizine (10mg/5mg)
                </p>

                <p className="mt-1 text-[12px] text-[#71819f]">
                  Dosage: Once daily (Bedtime) • Duration: 14 Days
                </p>
              </div>

              <div className="my-3 border-t border-[#dce3ed]" />

              <div>
                <p className="text-[14px] font-bold text-[#102349]">
                  2. Budesonide Inhaler (200mcg)
                </p>

                <p className="mt-1 text-[12px] text-[#71819f]">
                  Dosage: 2 Puffs twice daily • Duration: 30 Days
                </p>
              </div>
            </div>

            <div className="pt-1">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wide text-[#647692]">
                Recommended Tests
              </h4>

              <p className="mt-1 text-[14px] font-bold text-[#102349]">
                Spirometry (Lung Function Test)
              </p>

              <h4 className="mt-5 text-[11px] font-extrabold uppercase tracking-wide text-[#647692]">
                Follow-up Notes
              </h4>

              <p className="mt-1 text-[13px] leading-5 text-[#71819f]">
                Review in OPD clinic if nocturnal cough triggers worsen
                over next 7 days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function MedicalRecords() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    getPatientRecords().then(setRecords).catch(() => undefined);
  }, []);

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-['Outfit'] text-[#102349]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[260px] flex-col bg-[#091c42] px-6 py-6 lg:flex">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0da69a] text-white">
              <Icon name="truck" size={21} />
            </div>

            <div>
              <div className="text-[19px] font-extrabold leading-5 text-white">
                Swasthya
              </div>

              <div className="mt-1 text-[8px] font-bold tracking-[0.08em] text-[#10aaa0]">
                SMART INDIA HACKATHON
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-12 flex flex-col gap-2">
            <SidebarItem icon="home" label="Dashboard" onClick={() => goTo("/patient/dashboard")} />
            <SidebarItem icon="plus" label="New Case" onClick={() => goTo("/patient/case-taking?new=1")} />
            <SidebarItem icon="calendar" label="Appointments" onClick={() => goTo("/patient/case-review")} />
            <SidebarItem icon="chart" label="Medical Records" active onClick={() => goTo("/patient/medical-records")} />
            <SidebarItem icon="upload" label="Upload Reports" onClick={() => goTo("/patient/upload-reports")} />
          </nav>

          {/* Bottom Profile */}
          <div className="mt-auto border-t border-[#53617d] pt-4">
            <p className="text-[13px] font-extrabold text-white">
              Ananya Patel
            </p>

            <p className="mt-1 text-[11px] text-[#71819f]">
              PID-2026-0892
            </p>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="absolute inset-0 bg-black/40" />
            <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#091c42] px-6 py-6 text-white shadow-2xl">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0da69a]"><Icon name="truck" size={21} /></div><div><div className="text-[19px] font-extrabold">Swasthya</div><div className="mt-1 text-[8px] font-bold tracking-[0.08em] text-[#10aaa0]">SMART INDIA HACKATHON</div></div></div>
              <nav className="mt-10 flex flex-col gap-2">
                <SidebarItem icon="home" label="Dashboard" onClick={() => goTo("/patient/dashboard")} />
                <SidebarItem icon="plus" label="New Case" onClick={() => goTo("/patient/case-taking?new=1")} />
                <SidebarItem icon="calendar" label="Appointments" onClick={() => goTo("/patient/case-review")} />
                <SidebarItem icon="chart" label="Medical Records" active onClick={() => goTo("/patient/medical-records")} />
                <SidebarItem icon="upload" label="Upload Reports" onClick={() => goTo("/patient/upload-reports")} />
              </nav>
              <div className="mt-auto border-t border-[#53617d] pt-4"><p className="text-[13px] font-extrabold">Ananya Patel</p><p className="mt-1 text-[11px] text-[#71819f]">PID-2026-0892</p></div>
            </aside>
          </div>
        )}

        {/* MAIN AREA */}
        <main className="ml-0 min-h-screen flex-1 pt-[70px] lg:ml-[260px] lg:pt-0">
          <button type="button" onClick={() => setMobileMenuOpen(true)} className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 text-[#102349] shadow lg:hidden" aria-label="Open menu">☰</button>
          {/* TOP HEADER */}
          <header className="flex h-[80px] items-center border-b border-[#dce3ed] bg-white px-4 sm:px-6 lg:px-10">
            <h1 className="text-[25px] font-extrabold text-[#102349]">
              Medical Records
            </h1>

            <div className="ml-auto flex items-center gap-8">
              {/* Search */}
              <div className="hidden h-[38px] w-[280px] items-center gap-3 rounded-xl bg-[#f6f8fb] px-4 text-[#71819f] md:flex">
                <Icon name="search" size={18} />

                <span className="text-[14px]">
                  Search medical files, cases...
                </span>
              </div>

              {/* Notification */}
              <div className="relative text-[#102349]">
                <Icon name="bell" size={21} />

                <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-extrabold text-white">
                  3
                </span>
              </div>

              <div className="hidden text-[14px] font-extrabold text-[#102349] sm:block">
                Ananya Patel
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {/* Page Heading */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[29px] font-extrabold text-[#102349]">
                  Diagnostic &amp; Treatment History
                </h2>

                <p className="mt-1 text-[16px] text-[#71819f]">
                  Access verified clinical sheets, doctor prescriptions,
                  and laboratory reports securely.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <button className="h-[39px] rounded-lg border border-[#dce3ed] bg-white px-5 text-[13px] font-bold text-[#647692]">
                  Share with Doctor
                </button>

                <button className="h-[39px] rounded-lg bg-[#0e9e94] px-5 text-[13px] font-bold text-white">
                  Export All (PDF)
                </button>
              </div>
            </div>

            {/* Records */}
            <div className="mt-7 flex flex-col gap-6">
              {(records.length > 0 ? records : [
                { title: "No medical records yet", record_type: "", recorded_at: null }
              ]).map((record, index) => (
                <MedicalRecordCard
                  key={String(record.id || index)}
                  title={String(record.title || "Medical record")}
                  subtitle={`${String(record.record_type || "Clinical record")} ${record.recorded_at ? `• ${new Date(String(record.recorded_at)).toLocaleDateString()}` : ""}`}
                  expanded={index === 0}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MedicalRecords;