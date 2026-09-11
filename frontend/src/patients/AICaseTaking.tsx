export {};
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiError, askCaseAI, createCase, generateCaseSummary, getCase, selectCaseLanguage, type ConversationMessage } from "../services/api";

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
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
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
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

    case "records":
      return (
        <svg {...common}>
          <path d="M6 2h9l4 4v16H6z" />
          <path d="M14 2v5h5M9 13h6M9 17h6" />
        </svg>
      );

    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.6-1H6.7v-2.4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "truck":
      return (
        <svg {...common}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 10h4l3 3v4h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "mic":
      return (
        <svg {...common}>
          <rect x="9" y="3" width="6" height="12" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
        </svg>
      );

    case "sparkle":
      return (
        <svg {...common}>
          <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
          <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" />
        </svg>
      );

    default:
      return null;
  }
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d9f94] text-white">
        <Icon name="truck" size={20} />
      </div>

      <div>
        <div className="text-[20px] font-extrabold leading-5 text-white">
          Swasthya
        </div>
        <div className="mt-1 text-[8px] font-semibold tracking-[0.08em] text-[#16b8aa]">
          SMART INDIA HACKATHON
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`flex h-43px h-[43px] items-center gap-4 rounded-lg px-4 ${
        active
          ? "bg-[#109f94] text-white"
          : "text-[#6d7d9b]"
      }`}
    >
      <Icon name={icon} size={20} />

      <span className="text-[15px] font-bold">{label}</span>
    </button>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const goTo = (path: string) => navigate(path);
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[260px] flex-col bg-[#0b1d40] px-6 py-6 lg:flex">
      <Logo />

      <nav className="mt-8 flex flex-col gap-2">
        <SidebarItem icon="home" label="Dashboard" onClick={() => goTo("/patient/dashboard")} />

        <SidebarItem
          icon="plus"
          label="New Case"
          active
          onClick={() => goTo("/patient/case-taking?new=1")}
        />

        <SidebarItem icon="calendar" label="Appointments" onClick={() => goTo("/patient/case-review")} />

        <SidebarItem icon="records" label="Medical Records" onClick={() => goTo("/patient/medical-records")} />

        <SidebarItem icon="upload" label="Upload Reports" onClick={() => goTo("/patient/upload-reports")} />

        
      </nav>

      <div className="mt-auto border-t border-[#43516c] pt-5">
        <div className="text-[14px] font-extrabold text-white">
          Ananya Patel
        </div>

        <div className="mt-1 text-[11px] font-medium text-[#687995]">
          PID-2026-0892
        </div>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex h-[80px] items-center justify-between border-b border-[#dce3ed] bg-white px-4 sm:px-6 lg:left-[260px] lg:right-0 lg:px-10">
      <h1 className="text-[25px] font-extrabold tracking-[-0.5px] text-[#102349]">
        AI Symptom Assistant
      </h1>

      <div className="flex items-center gap-4 sm:gap-8">
        <div className="hidden h-[38px] w-[293px] items-center gap-3 rounded-xl bg-[#f6f8fb] px-4 text-[#71819c] md:flex">
          <Icon name="search" size={18} />

          <span className="text-[14px]">
            Search medical files, cases...
          </span>
        </div>

        <div className="relative text-[#102349]">
          <Icon name="bell" size={21} />

          <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#e8323d] px-1 text-[10px] font-bold text-white">
            3
          </span>
        </div>

        <div className="hidden text-[14px] font-extrabold text-[#102349] sm:block">
          Ananya Patel
        </div>
      </div>
    </header>
  );
}

function RoadmapStep({
  number,
  label,
  status,
}: {
  number: number;
  label: string;
  status: "done" | "active" | "upcoming";
}) {
  if (status === "done") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-24px h-[24px] w-24px w-[24px] items-center justify-center rounded-full bg-[#0d9f94] text-white">
          <Icon name="check" size={15} />
        </div>

        <span className="text-[15px] font-extrabold text-[#0d9f94]">
          {label}
        </span>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#fff1c7] text-[12px] font-bold text-[#e68a00]">
          {number}
        </div>

        <span className="text-[15px] font-extrabold text-[#e68a00]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#dbe3ed] bg-[#f7f9fc] text-[12px] font-bold text-[#70809b]">
        {number}
      </div>

      <span className="text-[15px] font-medium text-[#6b7d9a]">
        {label}
      </span>
    </div>
  );
}

export default function AICaseTaking() {
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [preferredLanguage, setPreferredLanguage] = useState<string | null>(null);
  const [languageSelectionResponse, setLanguageSelectionResponse] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState("Chief Complaint");
  const [completedSections, setCompletedSections] = useState<string[]>(["Personal Info"]);
  const [progress, setProgress] = useState(15);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      sender_type: "ai",
      message: "Which language would you like to continue in?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("new") === "1") {
      window.localStorage.removeItem("swasthya-current-case");
      setCaseId(null);
      setPreferredLanguage(null);
      setLanguageSelectionResponse(null);
      setCurrentSection("Chief Complaint");
      setCompletedSections(["Personal Info"]);
      setProgress(15);
      setMessages([{ sender_type: "ai", message: "Which language would you like to continue in?" }]);
      setMessage("");
      navigate("/patient/case-taking", { replace: true });
      return;
    }
    const savedCaseId = window.localStorage.getItem("swasthya-current-case");
    if (!savedCaseId) return;
    getCase(savedCaseId)
      .then((record) => {
        setCaseId(record.id);
        const history = record.structured_history || {};
        if (typeof history.preferredLanguage === "string") setPreferredLanguage(history.preferredLanguage);
        if (typeof history.currentSection === "string") setCurrentSection(history.currentSection);
        if (Array.isArray(history.completedSections)) setCompletedSections(history.completedSections.filter((item): item is string => typeof item === "string"));
        if (typeof history.progress === "number") setProgress(history.progress);
        if (record.conversation && record.conversation.length > 0) setMessages(record.conversation);
      })
      .catch(() => window.localStorage.removeItem("swasthya-current-case"));
  }, [location.search, navigate]);

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const quickSelect = (text: string) => {
    setMessage(text);
  };

  const submitMessage = async (): Promise<void> => {
    const answer = message.trim();
    if (!answer || loading) return;

    setLoading(true);
    try {
      if (!preferredLanguage) {
        const languageResult = await selectCaseLanguage(answer);
        const normalizedLanguage = /hindi|हिंदी/i.test(answer) ? "Hindi" : /english/i.test(answer) ? "English" : answer;
        setPreferredLanguage(normalizedLanguage);
        setLanguageSelectionResponse(answer);
        setCurrentSection(languageResult.currentSection);
        setCompletedSections(languageResult.completedSections);
        setProgress(languageResult.progress);
        setMessages((current) => [...current, { sender_type: "patient", message: answer }, { sender_type: "ai", message: languageResult.nextQuestion || "What problem are you experiencing?" }]);
        setMessage("");
        return;
      }

      let activeCaseId = caseId;
      if (!activeCaseId) {
        const newCase = await createCase(answer, preferredLanguage, languageSelectionResponse || undefined);
        activeCaseId = newCase.id;
        setCaseId(activeCaseId);
        window.localStorage.setItem("swasthya-current-case", activeCaseId);
      }

      setMessages((current) => [...current, { sender_type: "patient", message: answer }]);
      setMessage("");
      const result = await askCaseAI(activeCaseId, answer, preferredLanguage);
      setCurrentSection(result.currentSection);
      setCompletedSections(result.completedSections);
      setProgress(result.progress);
      if (result.nextQuestion) {
        setMessages((current) => [...current, { sender_type: "ai", message: result.nextQuestion as string }]);
      } else if (result.isComplete) {
        await generateCaseSummary(activeCaseId);
        setMessages((current) => [...current, { sender_type: "ai", message: "The case information is ready for doctor review." }]);
      }
    } catch (error) {
      alert(error instanceof ApiError ? error.message : "Unable to continue the case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex h-[70px] items-center justify-between bg-[#0b1d40] px-5 lg:hidden">
        <Logo />
        <button type="button" onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2 text-white" aria-label="Open menu">☰</button>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="absolute inset-0 bg-black/40" />
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#0b1d40] px-6 py-6 text-white shadow-2xl">
            <Logo />
            <nav className="mt-8 flex flex-col gap-2">
              <SidebarItem icon="home" label="Dashboard" onClick={() => goTo("/patient/dashboard")} />
              <SidebarItem icon="plus" label="New Case" active onClick={() => goTo("/patient/case-taking?new=1")} />
              <SidebarItem icon="calendar" label="Appointments" onClick={() => goTo("/patient/case-review")} />
              <SidebarItem icon="records" label="Medical Records" onClick={() => goTo("/patient/medical-records")} />
              <SidebarItem icon="upload" label="Upload Reports" onClick={() => goTo("/patient/upload-reports")} />
            </nav>
            <div className="mt-auto border-t border-[#43516c] pt-5"><div className="text-[14px] font-extrabold">Ananya Patel</div><div className="mt-1 text-[11px] text-[#687995]">PID-2026-0892</div></div>
          </aside>
        </div>
      )}

    <div className="min-h-screen bg-[#f7f9fc] font-['Outfit',sans-serif] text-[#102349]">
      <Sidebar />

      <Header />

      <main className="ml-0 pt-[80px] lg:ml-[260px]">
        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {/* Progress Header */}
          <section className="flex min-h-[98px] flex-col items-start justify-between gap-5 rounded-xl border border-[#dce3ed] bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-6 sm:py-0">
            <div>
              <div className="text-[13px] font-extrabold tracking-[0.02em] text-[#0d9f94]">
                INTAKE QUESTIONNAIRE
              </div>

              <h2 className="mt-2 text-[20px] font-extrabold text-[#102349]">
                Section: {currentSection}
              </h2>
            </div>

            <div className="w-full sm:w-[240px]">
              <div className="mb-2 text-right text-[13px] font-medium text-[#687b99]">
                Progress: Step {Math.min(6, Math.max(1, completedSections.length + 1))} of 6 ({progress}%)
              </div>

              <div className="h-[8px] overflow-hidden rounded-full bg-[#e0e5ed]">
                <div className="h-full bg-[#0d9f94]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* Conversation */}
            <section className="flex min-h-[520px] flex-col rounded-xl border border-[#dce3ed] bg-white p-6">
              <div className="flex-1">
                {messages.map((item, index) => item.sender_type === "patient" ? (
                  <div className={`${index === 0 ? "" : "mt-6 "}flex justify-end`} key={`${item.sender_type}-${index}`}>
                    <div className="max-w-[550px] rounded-xl bg-[#c8f6ed] px-4 py-4">
                      <p className="m-0 text-[15px] leading-[22px] text-[#166c68]">{item.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className={`${index === 0 ? "" : "mt-6 "}flex items-start gap-3`} key={`${item.sender_type}-${index}`}>
                    <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#0d9f94] text-white">
                      <Icon name="truck" size={18} />
                    </div>
                    <div className="max-w-[550px] rounded-xl bg-[#f5f7fa] px-4 py-4">
                      <div className="mb-1 text-[13px] font-extrabold text-[#0d9f94]">Swasthya Assistant</div>
                      <p className="m-0 text-[15px] leading-[22px] text-[#102349]">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="mt-6 rounded-xl border border-[#dce3ed] p-4">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-[12px] font-extrabold text-[#71819c]">
                    Quick Select:
                  </span>

                  <button
                    type="button"
                    onClick={() => quickSelect("Less than a week")}
                    className="rounded-full border border-[#dce3ed] bg-white px-4 py-1.5 text-[12px] font-medium text-[#102349] hover:bg-[#f5f8fb]"
                  >
                    Less than a week
                  </button>

                  <button
                    type="button"
                    onClick={() => quickSelect("1-2 weeks")}
                    className="rounded-full border border-[#dce3ed] bg-white px-4 py-1.5 text-[12px] font-medium text-[#102349] hover:bg-[#f5f8fb]"
                  >
                    1-2 weeks
                  </button>

                  <button
                    type="button"
                    onClick={() => quickSelect("More than a month")}
                    className="rounded-full border border-[#dce3ed] bg-white px-4 py-1.5 text-[12px] font-medium text-[#102349] hover:bg-[#f5f8fb]"
                  >
                    More than a month
                  </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your medical description..."
                    className="h-[50px] flex-1 rounded-lg border border-[#dce3ed] bg-[#f9fafc] px-4 text-[15px] text-[#102349] outline-none placeholder:text-[#71819c] focus:border-[#0d9f94]"
                  />

                  <button
                    type="button"
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#0d9f94] text-white"
                  >
                    <Icon name="mic" size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={submitMessage}
                    className="h-[50px] rounded-lg bg-[#0b1d40] px-7 text-[14px] font-extrabold text-white"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <aside className="h-fit rounded-xl border border-[#dce3ed] bg-white p-6">
              <h3 className="text-[19px] font-extrabold text-[#102349]">
                Intake Roadmap
              </h3>

              <div className="mt-6 space-y-5">
                <RoadmapStep
                  number={1}
                  label="Personal Info"
                  status={completedSections.includes("Personal Info") ? "done" : currentSection === "Personal Info" ? "active" : "upcoming"}
                />

                <RoadmapStep
                  number={2}
                  label="Chief Complaint"
                  status={completedSections.includes("Chief Complaint") ? "done" : currentSection === "Chief Complaint" ? "active" : "upcoming"}
                />

                <RoadmapStep
                  number={3}
                  label="Symptoms Detailed"
                  status={completedSections.includes("Symptoms Detailed") ? "done" : currentSection === "Symptoms Detailed" ? "active" : "upcoming"}
                />

                <RoadmapStep
                  number={4}
                  label="Medical History"
                  status={completedSections.includes("Medical History") ? "done" : currentSection === "Medical History" ? "active" : "upcoming"}
                />

                <RoadmapStep
                  number={5}
                  label="Active Medications"
                  status={completedSections.includes("Active Medications") ? "done" : currentSection === "Active Medications" ? "active" : "upcoming"}
                />

                <RoadmapStep
                  number={6}
                  label="Reports Sync"
                  status={completedSections.includes("Reports Sync") ? "done" : currentSection === "Reports Sync" ? "active" : "upcoming"}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}