BEGIN;

INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin.demo@swasthya.test', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'Demo', 'Admin', '9000000001'),
  ('00000000-0000-0000-0000-000000000002', 'doctor.one@swasthya.test', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor', 'Aarav', 'Mehta', '9000000002'),
  ('00000000-0000-0000-0000-000000000003', 'doctor.two@swasthya.test', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'doctor', 'Ishita', 'Rao', '9000000003'),
  ('00000000-0000-0000-0000-000000000004', 'patient.one@swasthya.test', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'patient', 'Demo', 'PatientOne', '9000000004'),
  ('00000000-0000-0000-0000-000000000005', 'patient.two@swasthya.test', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'patient', 'Demo', 'PatientTwo', '9000000005'),
  ('00000000-0000-0000-0000-000000000006', 'patient.three@swasthya.test', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'patient', 'Demo', 'PatientThree', '9000000006')
ON CONFLICT (id) DO NOTHING;

INSERT INTO doctors (id, user_id, license_number, specialization, qualifications, availability)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'DEMO-LICENSE-001', 'General Medicine', 'MBBS', '{"monday": ["09:00-13:00"], "wednesday": ["14:00-18:00"]}'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'DEMO-LICENSE-002', 'Family Medicine', 'MBBS, MD', '{"tuesday": ["10:00-14:00"], "thursday": ["15:00-19:00"]}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, user_id, date_of_birth, gender, blood_group, emergency_contact_name, emergency_contact_phone)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', '1995-04-12', 'unspecified', 'O+', 'Demo Contact One', '9000000011'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', '1988-09-23', 'unspecified', 'A+', 'Demo Contact Two', '9000000012'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', '2001-01-30', 'unspecified', 'B+', 'Demo Contact Three', '9000000013')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patient_cases (id, patient_id, assigned_doctor_id, chief_complaint, status, structured_history, ai_summary, urgent_flag, submitted_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Intermittent headache for two days', 'submitted', '{"duration": "2 days", "severity": "mild"}', '{"complaint": "headache", "follow_up_needed": true}', FALSE, NOW() - INTERVAL '2 days'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Fever and tiredness since yesterday', 'under_review', '{"duration": "1 day", "associated_symptoms": ["tiredness"]}', '{"complaint": "fever", "follow_up_needed": true}', FALSE, NOW() - INTERVAL '1 day'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', NULL, 'Mild stomach discomfort after a meal', 'draft', NULL, NULL, FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO appointments (id, patient_id, doctor_id, scheduled_start, scheduled_end, status, reason)
VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2030-06-10 09:00:00+00', '2030-06-10 09:30:00+00', 'pending', 'Follow-up for submitted case'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '2030-06-11 10:00:00+00', '2030-06-11 10:30:00+00', 'confirmed', 'Review reported symptoms')
ON CONFLICT (id) DO NOTHING;

INSERT INTO case_conversations (id, case_id, sender_type, sender_user_id, message, ai_metadata)
VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'patient', '00000000-0000-0000-0000-000000000004', 'I have had an intermittent headache for two days.', NULL),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'ai', NULL, 'How severe is the headache, and have you noticed any vision changes?', '{"type": "follow_up_question", "is_diagnostic": false}'),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', 'patient', '00000000-0000-0000-0000-000000000005', 'I have felt feverish and tired since yesterday.', NULL),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'ai', NULL, 'What temperature did you record, and are there any other symptoms?', '{"type": "follow_up_question", "is_diagnostic": false}')
ON CONFLICT (id) DO NOTHING;

COMMIT;