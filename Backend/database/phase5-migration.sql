ALTER TABLE patient_cases
  ADD COLUMN IF NOT EXISTS doctor_notes TEXT;

ALTER TABLE patient_cases
  DROP CONSTRAINT IF EXISTS patient_cases_status_check;

ALTER TABLE patient_cases
  ADD CONSTRAINT patient_cases_status_check
  CHECK (status IN ('draft', 'in_progress', 'submitted', 'reviewed', 'under_review', 'completed', 'cancelled'));