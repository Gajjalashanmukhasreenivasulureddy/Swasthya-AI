ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES patient_cases(id) ON DELETE SET NULL;

ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
UPDATE appointments SET status = 'pending' WHERE status = 'scheduled';
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'));

ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_doctor_start_unique;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_patient_start_unique;
CREATE UNIQUE INDEX IF NOT EXISTS appointments_doctor_active_slot_unique
  ON appointments(doctor_id, scheduled_start) WHERE status IN ('pending', 'confirmed');
CREATE UNIQUE INDEX IF NOT EXISTS appointments_patient_active_slot_unique
  ON appointments(patient_id, scheduled_start) WHERE status IN ('pending', 'confirmed');

CREATE TABLE IF NOT EXISTS doctor_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL UNIQUE REFERENCES doctors(id) ON DELETE CASCADE,
  weekly_schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 30 CHECK (slot_duration_minutes BETWEEN 5 AND 240),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_leave (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  leave_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT doctor_leave_unique_date UNIQUE (doctor_id, leave_date)
);

CREATE INDEX IF NOT EXISTS idx_appointments_doctor_status_start ON appointments(doctor_id, status, scheduled_start);
CREATE INDEX IF NOT EXISTS idx_appointments_case ON appointments(case_id);
CREATE INDEX IF NOT EXISTS idx_doctor_leave_doctor_date ON doctor_leave(doctor_id, leave_date);

DROP TRIGGER IF EXISTS doctor_schedules_set_updated_at ON doctor_schedules;
CREATE TRIGGER doctor_schedules_set_updated_at BEFORE UPDATE ON doctor_schedules
FOR EACH ROW EXECUTE FUNCTION set_updated_at();