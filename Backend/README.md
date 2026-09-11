# Swasthya Backend

Initial Node.js and Express foundation for Swasthya, an SIH 2026 patient case-taking platform.

## Prerequisites

- Node.js 20 or newer
- PostgreSQL for later development phases

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set the local environment values. `DATABASE_URL` and `JWT_SECRET` are required for database-backed and authenticated routes. `ADMIN_REGISTRATION_KEY` is required to create an admin account through the public registration endpoint.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Or start it without the file watcher:

   ```bash
   npm start
   ```

## PostgreSQL setup

Create a PostgreSQL database, set its connection string in `.env` as `DATABASE_URL`, and run the schema and demo seed files with your PostgreSQL client:

```bash
psql "$env:DATABASE_URL" -f database/schema.sql
psql "$env:DATABASE_URL" -f database/seed.sql
```

On Windows PowerShell, set the connection string for the current terminal session with:

```powershell
$env:DATABASE_URL = "postgresql://username:password@localhost:5432/swasthya"
```

Verify the Node.js connection with:

```bash
npm run db:check
```

The seed data is entirely fictional and is intended only for development. It must not be used as real patient data.

## Authentication routes

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Send a JWT as `Authorization: Bearer <token>` to access these role-check routes:

```text
GET /api/protected/patient
GET /api/protected/doctor
GET /api/protected/admin
```

Admin registration requires the server-side `ADMIN_REGISTRATION_KEY`; it is never accepted from the frontend without matching the configured environment value.

## Doctor dashboard routes

The authenticated doctor dashboard is available at:

```text
GET  /api/doctors/me/dashboard
GET  /api/doctors/me/cases
GET  /api/doctors/me/cases/new
GET  /api/doctors/me/cases/urgent
GET  /api/doctors/me/patients
GET  /api/doctors/me/patients/:patientId
GET  /api/doctors/me/cases/:caseId
GET  /api/doctors/me/cases/:caseId/summary
GET  /api/doctors/me/cases/:caseId/conversation
POST /api/doctors/me/cases/:caseId/notes
PUT  /api/doctors/me/cases/:caseId/notes/:noteId
POST /api/doctors/me/cases/:caseId/review
POST /api/doctors/me/cases/:caseId/complete
GET  /api/doctors/me/notifications
```

Dashboard case and patient data is restricted to relationships established by assigned cases. Separate doctor notes are stored in `doctor_case_notes`.

## Schedule and appointment routes

```text
GET/PUT /api/doctors/me/schedule
GET/POST /api/doctors/me/leave
DELETE   /api/doctors/me/leave/:leaveId
POST     /api/appointments
GET      /api/appointments/:appointmentId
PATCH    /api/appointments/:appointmentId/cancel
GET      /api/doctors/me/appointments
PATCH    /api/doctors/me/appointments/:appointmentId/confirm
PATCH    /api/doctors/me/appointments/:appointmentId/complete
GET      /api/patients/me/appointments
GET      /api/doctors/:doctorId/availability?date=YYYY-MM-DD
```

Appointments use 30-minute slots by default, enforce schedule/break/leave checks, and prevent active double booking with PostgreSQL partial unique indexes.

## Secure messaging and notifications

Case messages:

```text
GET  /api/cases/:caseId/messages?page=1&limit=30
POST /api/cases/:caseId/messages
POST /api/doctors/me/cases/:caseId/messages
```

In-app notifications:

```text
GET   /api/notifications?page=1&limit=20&unreadOnly=true
GET   /api/notifications/unread-count
PATCH /api/notifications/:notificationId/read
PATCH /api/notifications/read-all
```

Messages are stored in `case_conversations` and authorized through the authenticated patient/case owner or assigned doctor. Notifications are stored in `notifications`, use deduplication keys for event retries, and are scoped to the authenticated recipient.

## AI case-taking routes

The Gemini service is server-side only and reads `GEMINI_API_KEY` from `.env`:

```text
POST /api/ai/next-question
POST /api/ai/generate-summary
POST /api/cases/:id/ai-question
POST /api/cases/:id/generate-summary
```

AI responses are validated as structured JSON before they are returned or saved. The service collects history dynamically for arbitrary complaints and does not diagnose, prescribe medication, or recommend dosages. If Gemini is unavailable or returns malformed/unsafe content, the API returns a controlled error and does not save an AI message or summary.

## Health check

With the server running, request:

```text
GET http://localhost:5000/api/health
```

Expected response shape:

```json
{
  "status": "ok",
  "service": "swasthya-backend",
  "timestamp": "..."
}
```

## Phase 1 structure

```text
src/
  config/
    database.js
    env.js
  middleware/
    security.js
  routes/
    health.routes.js
  app.js
  server.js
```