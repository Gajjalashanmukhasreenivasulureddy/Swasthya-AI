const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const TOKEN_KEY = "swasthya-token";

export type User = {
	id: string;
	email: string;
	role: "patient" | "doctor" | "admin";
	first_name: string;
	last_name: string;
	phone?: string | null;
	profile_id?: string | null;
	license_number?: string | null;
	specialization?: string | null;
};

export type ConversationMessage = {
	id?: string;
	sender_type: "patient" | "doctor" | "ai" | "system";
	message: string;
	created_at?: string;
};

export type CaseRecord = {
	id: string;
	patient_id: string;
	doctor_id?: string | null;
	chief_complaint: string;
	status: string;
	patient_first_name?: string;
	patient_last_name?: string;
	structured_history?: Record<string, unknown> | null;
	ai_summary?: Record<string, unknown> | null;
	urgent_flag?: boolean;
	urgent_message?: string | null;
	conversation?: ConversationMessage[];
	created_at?: string;
	submitted_at?: string | null;
	reviewed_at?: string | null;
	completed_at?: string | null;
	doctor_notes?: string | null;
};

export type PatientProfile = User & {
	patient_id: string;
	date_of_birth?: string | null;
	gender?: string | null;
	blood_group?: string | null;
	emergency_contact_name?: string | null;
	emergency_contact_phone?: string | null;
	address?: string | null;
};

export type Appointment = {
	id: string;
	doctor_id?: string;
	patient_id?: string;
	case_id?: string | null;
	scheduled_start: string;
	scheduled_end: string;
	status: string;
	reason?: string | null;
	notes?: string | null;
	doctor_first_name?: string;
	doctor_last_name?: string;
	patient_first_name?: string;
	patient_last_name?: string;
	specialization?: string;
};

export type DoctorDashboard = {
	total_assigned_cases: number;
	new_submitted_cases: number;
	awaiting_review_cases: number;
	reviewed_cases: number;
	completed_cases: number;
	urgent_cases: number;
	todays_appointments_count: number;
};

export type DoctorSchedule = {
	weeklySchedule: Record<string, unknown>;
	slotDurationMinutes: number;
};

export type AIQuestion = {
	nextQuestion: string | null;
	informationCollected: Record<string, unknown>;
	missingInformation: string[];
	isComplete: boolean;
	urgency: "normal" | "urgent" | "unknown";
	currentSection: string;
	completedSections: string[];
	progress: number;
	preferredLanguage?: string;
};

export type AISummary = {
	chiefComplaint: string | null;
	historyOfPresentIllness: string | null;
	symptoms: string[];
	medicalHistory: string[];
	medications: string[];
	allergies: string[];
	familyHistory: string[];
	lifestyleHistory: string[];
	importantFindings: string[];
	missingInformation: string[];
	redFlags: string[];
	followUpQuestions: string[];
	clinicalObservations: string[];
	possibleConsiderations: string[];
	suggestedNextSteps: string[];
	urgency: "normal" | "urgent" | "unknown";
};

type ApiResponse<T> = {
	data?: T;
	user?: User;
	token?: string;
	error?: { message?: string } | string;
};

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers = new Headers(options.headers);
	headers.set("Content-Type", "application/json");
	const token = getToken();
	if (token) headers.set("Authorization", `Bearer ${token}`);

	let response: Response;
	try {
		response = await fetch(`${API_URL}${path}`, { ...options, headers });
	} catch {
		throw new ApiError("The backend is unavailable. Please try again.", 0);
	}

	const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;
	if (!response.ok) {
		if (response.status === 401) clearToken();
		const error = typeof payload.error === "string" ? payload.error : payload.error?.message;
		throw new ApiError(error || "The request could not be completed.", response.status);
	}
	return (payload.data === undefined ? payload : payload.data) as T;
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
	const result = await request<{ user: User; token: string }>("/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password })
	});
	setToken(result.token);
	return result;
}

export async function registerPatient(input: {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
}): Promise<{ user: User; token: string }> {
	const result = await request<{ user: User; token: string }>("/auth/register", {
		method: "POST",
		body: JSON.stringify({ ...input, role: "patient" })
	});
	setToken(result.token);
	return result;
}

export function getCurrentUser(): Promise<{ user: User }> {
	return request<{ user: User }>("/auth/me");
}

export function createCase(chiefComplaint: string, preferredLanguage?: string, languageSelectionResponse?: string): Promise<CaseRecord> {
	return request<CaseRecord>("/cases", {
		method: "POST",
		body: JSON.stringify({ chief_complaint: chiefComplaint, ...(preferredLanguage ? { preferred_language: preferredLanguage } : {}), ...(languageSelectionResponse ? { language_selection_response: languageSelectionResponse } : {}) })
	});
}

export function getCase(caseId: string): Promise<CaseRecord> {
	return request<CaseRecord>(`/cases/${caseId}`);
}

export function getDoctorNewCases(): Promise<{ cases: CaseRecord[] }> {
	return request<{ cases: CaseRecord[] }>("/doctors/me/cases/new");
}

export function sendCaseMessage(caseId: string, message: string): Promise<ConversationMessage> {
	return request<ConversationMessage>(`/cases/${caseId}/conversation`, {
		method: "POST",
		body: JSON.stringify({ message })
	});
}

export function selectCaseLanguage(preferredLanguage: string): Promise<AIQuestion> {
	return request<AIQuestion>("/ai/next-question", {
		method: "POST",
		body: JSON.stringify({ stage: "language_selection", preferredLanguage })
	});
}

export function askCaseAI(caseId: string, message?: string, preferredLanguage?: string): Promise<AIQuestion> {
	return request<AIQuestion>(`/cases/${caseId}/ai-question`, {
		method: "POST",
		body: JSON.stringify({ ...(message === undefined ? {} : { message }), preferredLanguage })
	});
}

export function generateCaseSummary(caseId: string): Promise<AISummary> {
	return request<AISummary>(`/cases/${caseId}/generate-summary`, { method: "POST" });
}

export function updateCase(caseId: string, fields: Record<string, unknown>): Promise<CaseRecord> {
	return request<CaseRecord>(`/cases/${caseId}`, {
		method: "PUT",
		body: JSON.stringify(fields)
	});
}

export function submitCase(caseId: string): Promise<CaseRecord> {
	return request<CaseRecord>(`/cases/${caseId}/submit`, { method: "POST" });
}

export function getPatientProfile(): Promise<PatientProfile> {
	return request<PatientProfile>("/patients/me");
}

export function updatePatientProfile(fields: Record<string, unknown>): Promise<PatientProfile> {
	return request<PatientProfile>("/patients/me", { method: "PUT", body: JSON.stringify(fields) });
}

export function getPatientCases(): Promise<CaseRecord[]> {
	return request<CaseRecord[]>("/patients/me/cases");
}

export function getPatientAppointments(): Promise<Appointment[]> {
	return request<Appointment[]>("/patients/me/appointments");
}

export function getPatientRecords(): Promise<Record<string, unknown>[]> {
	return request<Record<string, unknown>[]>("/patients/me/records");
}

export function getDoctorDashboard(): Promise<DoctorDashboard> {
	return request<DoctorDashboard>("/doctors/me/dashboard");
}

export function getDoctorCases(): Promise<{ cases: CaseRecord[] }> {
	return request<{ cases: CaseRecord[] }>("/doctors/me/cases");
}

export function getDoctorPatients(): Promise<{ patients: Record<string, unknown>[] }> {
	return request<{ patients: Record<string, unknown>[] }>("/doctors/me/patients");
}

export function getDoctorProfile(): Promise<Record<string, unknown>> {
	return request<Record<string, unknown>>("/doctors/me");
}

export function getDoctorSchedule(): Promise<DoctorSchedule> {
	return request<DoctorSchedule>("/doctors/me/schedule");
}

export function updateDoctorSchedule(schedule: DoctorSchedule): Promise<DoctorSchedule> {
	return request<DoctorSchedule>("/doctors/me/schedule", { method: "PUT", body: JSON.stringify(schedule) });
}

export function confirmAppointment(id: string): Promise<Appointment> {
	return request<Appointment>(`/doctors/me/appointments/${id}/confirm`, { method: "PATCH" });
}

export function completeAppointment(id: string): Promise<Appointment> {
	return request<Appointment>(`/doctors/me/appointments/${id}/complete`, { method: "PATCH" });
}

export function cancelAppointment(id: string): Promise<Appointment> {
	return request<Appointment>(`/appointments/${id}/cancel`, { method: "PATCH" });
}

export function reviewCase(caseId: string, doctorNotes?: string): Promise<CaseRecord> {
	return request<CaseRecord>(`/doctors/me/cases/${caseId}/review`, {
		method: "POST",
		body: JSON.stringify(doctorNotes === undefined ? {} : { doctor_notes: doctorNotes })
	});
}

export function completeCase(caseId: string): Promise<CaseRecord> {
	return request<CaseRecord>(`/doctors/me/cases/${caseId}/complete`, { method: "POST" });
}

export function getNotifications(): Promise<Record<string, unknown>[]> {
	return request<Record<string, unknown>[]>("/notifications");
}
