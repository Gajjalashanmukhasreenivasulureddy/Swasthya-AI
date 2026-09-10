CREATE TABLE IF NOT EXISTS doctor_case_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES patient_cases(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_case_notes_case_created ON doctor_case_notes(case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_doctor_case_notes_doctor ON doctor_case_notes(doctor_id);

DROP TRIGGER IF EXISTS doctor_case_notes_set_updated_at ON doctor_case_notes;
CREATE TRIGGER doctor_case_notes_set_updated_at BEFORE UPDATE ON doctor_case_notes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();