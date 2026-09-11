import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type SidebarRole = "doctor" | "patient";

type SidebarProps = {
	role: SidebarRole;
	profileName?: string;
	profileId?: string;
};

const doctorItems = [
	["Dashboard", "/doctor/dashboard", "home"],
	["Patients", "/doctor/patients", "patients"],
	["Queue", "/doctor/queue", "queue"],
	["Schedule", "/doctor/schedule", "calendar"],
	["Reports", "/doctor/case-sheet", "reports"],
] as const;

const patientItems = [
	["Dashboard", "/patient/dashboard", "home"],
	["New Case", "/patient/case-taking", "plus"],
	["Appointments", "/patient/case-review", "calendar"],
	["Medical Records", "/patient/medical-records", "records"],
	["Upload Reports", "/patient/upload-reports", "upload"],
] as const;

function Icon({ name, size = 20 }: { name: string; size?: number }) {
	const common = {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 1.8,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
	};

	if (name === "home") return <svg {...common}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></svg>;
	if (name === "patients") return <svg {...common}><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0 1 14 0v2M16 4.5a4 4 0 0 1 0 5M19 14a5 5 0 0 1 3 4.5V21" /></svg>;
	if (name === "queue") return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>;
	if (name === "calendar") return <svg {...common}><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9h18" /></svg>;
	if (name === "reports") return <svg {...common}><path d="M4 20V10M10 20V4M16 20v-7M22 20V7" /></svg>;
	if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
	if (name === "records") return <svg {...common}><path d="M6 2h9l4 4v16H6zM14 2v5h5M9 13h6M9 17h6" /></svg>;
	return <svg {...common}><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg>;
}

function Brand({ onClick }: { onClick: () => void }) {
	return (
		<button type="button" onClick={onClick} className="flex items-center gap-3 text-left" aria-label="Go to Swasthya home">
			<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0f9f94] text-xl text-white">+</span>
			<span>
				<span className="block text-[19px] font-extrabold leading-none text-white">Swasthya</span>
				<span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.09em] text-[#0fa59a]">Smart India Hackathon</span>
			</span>
		</button>
	);
}

function Sidebar({ role, profileName, profileId }: SidebarProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const items = role === "doctor" ? doctorItems : patientItems;
	const name = profileName ?? (role === "doctor" ? "Dr. Rohan Sharma" : "Ananya Patel");
	const id = profileId ?? (role === "doctor" ? "MCI-2026-9485" : "PID-2026-0892");
	const goTo = (path: string) => {
		setMobileMenuOpen(false);
		navigate(path);
	};
	const navigation = (
		<nav className="flex flex-col gap-1">
			{items.map(([label, path, icon]) => {
				const active = location.pathname === path;
				return (
					<button key={path} type="button" onClick={() => goTo(path)} className={`flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left text-[15px] font-bold transition-colors ${active ? "bg-[#109f96] text-white" : "text-[#71819d] hover:bg-white/5 hover:text-white"}`}>
						<Icon name={icon} />
						<span>{label}</span>
					</button>
				);
			})}
		</nav>
	);
	const profile = <div className="mt-auto border-t border-[#52627d]/50 pt-4"><p className="text-[14px] font-bold text-white">{name}</p><p className="mt-0.5 text-[11px] font-medium text-[#71819d]">{id}</p></div>;

	return (
		<>
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#0d2147] px-6 pb-6 pt-6 lg:flex">
				<Brand onClick={() => goTo("/")} />
				<div className="mt-8">{navigation}</div>
				{profile}
			</aside>
			<div className="fixed left-0 right-0 top-0 z-40 flex h-[70px] items-center justify-between bg-[#0d2147] px-5 lg:hidden">
				<Brand onClick={() => goTo("/")} />
				<button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="rounded-lg p-2 text-white transition-colors hover:bg-white/10" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}><Icon name="queue" size={23} /></button>
			</div>
			{mobileMenuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-black/40" /><aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#0d2147] px-5 pb-6 pt-6 shadow-2xl"><Brand onClick={() => goTo("/")} /><div className="mt-8">{navigation}</div>{profile}</aside></div>}
		</>
	);
}

export default Sidebar;
