import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { ApiError, getCase, submitCase, type CaseRecord } from "../services/api";
=======
import Sidebar from "../components/Sidebar";
>>>>>>> 929a001c34478e23a80f8a924cfb852e8d42c6bc

function CaseReview() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [loading, setLoading] = useState(() => Boolean(window.localStorage.getItem("swasthya-current-case")));

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

    useEffect(() => {
      const caseId = window.localStorage.getItem("swasthya-current-case");
      if (!caseId) {
        return;
      }
      getCase(caseId)
        .then(setCaseRecord)
        .catch((error) => alert(error instanceof ApiError ? error.message : "Unable to load this case."))
        .finally(() => setLoading(false));
    }, []);

    const history = caseRecord?.structured_history || {};
    const summary = caseRecord?.ai_summary || {};
    const listText = (value: unknown) => Array.isArray(value) ? value.join(", ") : typeof value === "string" ? value : "Not provided";
    const summaryText = (value: unknown) => typeof value === "string" && value.trim() ? value : "Not provided";
    const finishCase = async () => {
      if (!caseRecord) return;
      try {
        await submitCase(caseRecord.id);
        navigate("/patient/dashboard");
      } catch (error) {
        alert(error instanceof ApiError ? error.message : "Unable to submit this case.");
      }
    };
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#102349]">
      <Sidebar role="patient" />

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
          <button type="button" onClick={() => goTo("/patient/dashboard")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[19px]">⌂</span><span className="text-[15px] font-semibold">Dashboard</span></button>
          <button type="button" onClick={() => goTo("/patient/case-taking?new=1")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[22px] font-light">+</span><span className="text-[15px] font-semibold">New Case</span></button>
          <button type="button" onClick={() => goTo("/patient/case-review")} className="flex h-11 items-center gap-4 rounded-[8px] bg-[#0f9d92] px-4 text-white"><span className="text-[18px]">▣</span><span className="text-[15px] font-semibold">Appointments</span></button>
          <button type="button" onClick={() => goTo("/patient/medical-records")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[18px]">▥</span><span className="text-[15px] font-bold">Medical Records</span></button>
          <button type="button" onClick={() => goTo("/patient/upload-reports")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[18px]">↥</span><span className="text-[15px] font-semibold">Upload Reports</span></button>
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


        {mobileMenuOpen && (
          <div className="hidden">
            <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="absolute inset-0 bg-black/40" />
            <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#0b1d41] px-6 py-6 text-white shadow-2xl">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#0fa397]">✚</div><div><div className="text-[20px] font-extrabold">Swasthya</div><div className="text-[8px] font-bold tracking-[0.5px] text-[#0fa397]">SMART INDIA HACKATHON</div></div></div>
<nav className="mt-8 flex flex-col gap-2 px-5">
              <button type="button" onClick={() => goTo("/patient/dashboard")} className="flex h-11 items-center gap-4 rounded-lg px-4 text-[#687994]">⌂ <span>Dashboard</span></button>
              <button type="button" onClick={() => goTo("/patient/case-taking?new=1")} className="flex h-11 items-center gap-4 rounded-lg px-4 text-[#687994]">+ <span>New Case</span></button>
              <button type="button" onClick={() => goTo("/patient/case-review")} className="flex h-11 items-center gap-4 rounded-lg px-4 text-white">▣ <span>Appointments</span></button>
              <button type="button" onClick={() => goTo("/patient/medical-records")} className="flex h-11 items-center gap-4 rounded-lg px-4 text-[#687994]">▥ <span>Medical Records</span></button>
              <button type="button" onClick={() => goTo("/patient/upload-reports")} className="flex h-11 items-center gap-4 rounded-lg px-4 text-[#687994]">↥ <span>Upload Reports</span></button>
            </nav>
              <div className="mt-auto border-t border-[#31415e] pt-5"><p className="text-[13px] font-bold">Ananya Patel</p><p className="mt-1 text-[11px] text-[#687994]">PID-2026-0892</p></div>
            </aside>
          </div>
        )}

      {/* ================= MAIN AREA ================= */}
      <main className="ml-0 min-h-screen pt-[70px] lg:ml-[260px] lg:pt-0">
        <button type="button" onClick={() => setMobileMenuOpen(true)} className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 text-[#102349] shadow lg:hidden" aria-label="Open menu">☰</button>

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
                content="Patient information is available in the registered profile."
              />

              <CaseCard
                title="Chief Complaint"
                content={caseRecord?.chief_complaint || (loading ? "Loading case..." : "No case selected.")}
              />

              <CaseCard
                title="Symptoms Detailed"
                content={`Symptoms: ${listText(summary.symptoms || history.symptoms)}. Duration: ${summaryText(history.symptom_duration)}. Severity: ${summaryText(history.severity)}.`}
              />

              <CaseCard
                title="Medical History"
                content={`Medical history: ${listText(summary.medicalHistory || history.medical_history)}. Family history: ${listText(summary.familyHistory || history.family_history)}.`}
              />

              <CaseCard
                title="Active Medications"
                content={`Medications: ${listText(summary.medications || history.medication_history)}. Allergies: ${listText(summary.allergies || history.allergy_history)}.`}
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
                    value={caseRecord ? caseRecord.patient_id : "Not available"}
                  />

                  <InfoRow
                    label="PID:"
                    value={caseRecord?.id || "Not available"}
                  />

                  <InfoRow
                    label="Date Started:"
                    value="Current case"
                  />

                  <div className="flex items-center justify-between">

                    <span className="text-[#6c7d98]">
                      Status:
                    </span>

                    <span className="rounded-[5px] bg-[#c9f6df] px-3 py-1 text-[11px] font-extrabold text-[#0baf79]">
                      {caseRecord?.status === "submitted" ? "SUBMITTED" : "READY"}
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
                  {summaryText(summary.historyOfPresentIllness || summary.importantFindings)}

                </p>


                <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-[#71809a]">
                  Extracted Tags:
                </p>


                <div className="mt-2 flex flex-wrap gap-2">

                  {(Array.isArray(summary.symptoms) && summary.symptoms.length > 0 ? summary.symptoms : [caseRecord?.urgent_flag ? "Urgent attention" : "Case information"]).map((tag) => <Tag key={tag} text={tag} />)}

                </div>


                <p className="mt-5 text-[11px] italic leading-[17px] text-[#71809a]">

                  Disclaimer: This summary was generated by AI and will be
                  reviewed by your doctor.

                </p>

              </div>


              {/* Submit / Draft */}
              <div className="space-y-3">

                <button onClick={finishCase} className="flex h-[53px] w-full items-center justify-center rounded-[8px] bg-[#0f9d92] text-[15px] font-extrabold text-white transition hover:bg-[#0b8c82]">
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