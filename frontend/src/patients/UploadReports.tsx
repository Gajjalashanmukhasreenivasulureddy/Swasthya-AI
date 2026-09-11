export {};
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function UploadReports() {
  const navigate = useNavigate();
  const goTo = (path: string) => {
    navigate(path);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState([
    {
      name: "CBC_Hematology_Oct_2026.pdf",
      size: "1.2 MB",
      date: "Uploaded Oct 25, 2026",
      status: "AI Analysed",
    },
    {
      name: "Chest_XRay_Lateral_View.png",
      size: "4.8 MB",
      date: "Uploaded Oct 25, 2026",
      status: "OCR Ready",
    },
    {
      name: "Amoxycillin_Prescription_Fortis.jpg",
      size: "850 KB",
      date: "Uploaded Oct 21, 2026",
      status: "Extracted",
    },
  ]);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      date: "Uploaded just now",
      status: "Processing",
    }));

    setFiles((previousFiles) => [...previousFiles, ...newFiles]);
  };

  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((previousFiles) =>
      previousFiles.filter((_, fileIndex) => fileIndex !== index),
    );
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
          <button type="button" onClick={() => goTo("/patient/case-taking")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[22px] font-light">+</span><span className="text-[15px] font-semibold">New Case</span></button>
          <button type="button" onClick={() => goTo("/patient/case-review")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[18px]">▣</span><span className="text-[15px] font-semibold">Appointments</span></button>
          <button type="button" onClick={() => goTo("/patient/medical-records")} className="flex h-11 items-center gap-4 rounded-[8px] px-4 text-[#687994]"><span className="text-[18px]">▥</span><span className="text-[15px] font-bold">Medical Records</span></button>
          <button type="button" onClick={() => goTo("/patient/upload-reports")} className="flex h-11 items-center gap-4 rounded-[8px] bg-[#0f9d92] px-4 text-white"><span className="text-[18px]">↥</span><span className="text-[15px] font-semibold">Upload Reports</span></button>
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


      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-0 min-h-screen pt-[70px] lg:ml-[260px] lg:pt-0">

        {/* Header */}
        <header className="flex h-[80px] items-center justify-between border-b border-[#dce3ed] bg-white px-4 sm:px-6 lg:px-10">

          <h1 className="text-[25px] font-extrabold tracking-[-0.5px]">
            Medical Records Sync
          </h1>

          <div className="flex items-center gap-4 sm:gap-8">

            {/* Search */}
            <div className="hidden h-[38px] w-[280px] items-center gap-3 rounded-[9px] bg-[#f6f8fb] px-4 text-[#71819a] md:flex">
              <span className="text-[18px]">
                ⌕
              </span>

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


        {/* ================= PAGE CONTENT ================= */}
        <section className="px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pt-10">

          {/* Heading */}
          <div className="mb-7">

            <h2 className="text-[30px] font-extrabold tracking-[-0.8px]">
              Upload Medical Reports
            </h2>

            <p className="mt-1 text-[16px] text-[#687b99]">
              Share prior blood tests, diagnostic charts, prescription
              receipts, or radiological imaging studies.
            </p>

          </div>


          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">

            {/* ================= LEFT COLUMN ================= */}
            <div>

              {/* Upload Area */}
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onClick={handleBrowse}
                className="flex h-[221px] cursor-pointer flex-col items-center justify-center rounded-[11px] border-2 border-dashed border-[#0f9d92] bg-white transition hover:bg-[#f8fffe]"
              >

                {/* Upload Icon */}
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#d4faf3]">
                  <span className="text-[28px] text-[#0f9d92]">
                    ⇧
                  </span>
                </div>

                <h3 className="mt-4 text-[18px] font-extrabold">
                  Drag and drop files here or click to browse
                </h3>

                <p className="mt-1 text-[14px] text-[#71819a]">
                  Supported document formats: PDF, JPG, PNG, DICOM
                  (Max file size: 25MB)
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.dcm"
                  onChange={handleFileInput}
                  className="hidden"
                />

              </div>


              {/* Uploaded Files */}
              <div className="mt-8 rounded-[11px] border border-[#dce3ed] bg-white p-6">

                <h3 className="text-[19px] font-extrabold">
                  Uploaded Files
                </h3>


                <div className="mt-5 space-y-4">

                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-[9px] border border-[#dce3ed] bg-[#f8fafc] px-4 py-3"
                    >

                      <div className="flex min-w-0 items-center gap-4">

                        {/* File Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[7px] bg-[#d4faf3]">
                          <span className="text-[20px] text-[#0f9d92]">
                            ▧
                          </span>
                        </div>


                        {/* File Details */}
                        <div className="min-w-0">

                          <p className="truncate text-[14px] font-bold text-[#102349]">
                            {file.name}
                          </p>

                          <div className="mt-1 flex items-center gap-3 text-[12px] text-[#71819a]">

                            <span>
                              {file.size}
                            </span>

                            <span>
                              •
                            </span>

                            <span>
                              {file.date}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* Status + Remove */}
                      <div className="ml-4 flex shrink-0 items-center gap-5">

                        <span className="rounded-[6px] bg-[#c9f6df] px-3 py-1 text-[11px] font-extrabold text-[#0caf7b]">
                          {file.status}
                        </span>

                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-[12px] font-bold text-[#ef3030] hover:underline"
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </div>


            {/* ================= RIGHT COLUMN ================= */}
            <div>

              {/* Report Folders */}
              <div className="rounded-[11px] border border-[#dce3ed] bg-white p-6">

                <h3 className="text-[18px] font-extrabold">
                  Report Folders
                </h3>


                <div className="mt-5 space-y-3">

                  <Folder
                    title="Lab Reports"
                    count="4 files"
                  />

                  <Folder
                    title="Imaging & X-Rays"
                    count="2 files"
                  />

                  <Folder
                    title="Active Prescriptions"
                    count="2 files"
                  />

                  <Folder
                    title="General Patient Intake"
                    count="0 files"
                  />

                </div>

              </div>


              {/* Actions */}
              <div className="mt-6 space-y-3">

                <button onClick={() => navigate("/patient/case-review")} className="flex h-[51px] w-full items-center justify-center rounded-[8px] bg-[#0f9d92] text-[15px] font-extrabold text-white transition hover:bg-[#0b8c82]">
                  Continue to Review
                </button>

                <button onClick={() => navigate("/patient/case-taking")} className="flex h-[51px] w-full items-center justify-center rounded-[8px] border border-[#dce3ed] bg-white text-[15px] font-bold text-[#102349] transition hover:bg-[#f7f9fc]">
                  Back to Case Intake
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
   FOLDER COMPONENT
============================================================ */

function Folder({
  title,
  count,
}: {
  title: string;
  count: string;
}) {
  return (
    <button className="flex h-[42px] w-full items-center justify-between rounded-[8px] border border-[#dce3ed] bg-white px-3 text-left transition hover:bg-[#f7f9fc]">

      <span className="text-[14px] font-bold text-[#102349]">
        {title}
      </span>

      <span className="text-[12px] text-[#71819a]">
        {count}
      </span>

    </button>
  );
}


/* ============================================================
   FILE SIZE FORMATTER
============================================================ */

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


export default UploadReports;