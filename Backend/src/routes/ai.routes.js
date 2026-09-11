const express = require('express');
const pool = require('../config/database');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { getAuthorizedCase } = require('./case.routes');
const {
  GeminiServiceError,
  generateNextQuestion,
  generateCaseSummary
} = require('../services/ai.service');
const { success, failure } = require('../utils/response');
const { safeCreateNotification } = require('../services/notification.service');
const { translateQuestion, MultilingualServiceError } = require('../services/multilingual.service');

const router = express.Router();
const caseIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const safetyMessage = 'Potentially urgent symptoms were identified. Please seek immediate professional or emergency medical attention.';

function validCaseId(id) {
  return typeof id === 'string' && caseIdPattern.test(id);
}

function validInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be an object';
  if (body.caseData !== undefined && (typeof body.caseData !== 'object' || Array.isArray(body.caseData))) return 'caseData must be an object';
  if (body.conversation !== undefined && !Array.isArray(body.conversation)) return 'conversation must be an array';
  if (Array.isArray(body.conversation) && body.conversation.length > 50) return 'conversation is too large';
  if (body.preferredLanguage !== undefined && (typeof body.preferredLanguage !== 'string' || body.preferredLanguage.length > 50)) return 'preferredLanguage is invalid';
  return null;
}

function aiFailure(error, response, next) {
  if (!(error instanceof GeminiServiceError) && !(error instanceof MultilingualServiceError)) return next(error);
  console.error('Gemini AI request failed:', error.code);
  const statusCode = error.code === 'AI_NOT_CONFIGURED' || error.code === 'AI_UNAVAILABLE' || error.code === 'TRANSLATION_UNAVAILABLE' ? 503 : 502;
  const message = error.code === 'TRANSLATION_UNAVAILABLE'
    ? 'The multilingual service is temporarily unavailable. Please try again.'
    : error.code === 'AI_UNAVAILABLE'
    ? 'The AI service is temporarily unavailable. Check the Gemini API quota or try again later.'
    : error.code === 'AI_UNSAFE_RESPONSE'
      ? 'The AI returned unsafe content and the response was discarded'
      : 'The AI service could not return a valid case-taking response';
  return failure(response, error.code === 'AI_UNSAFE_RESPONSE'
    ? 'The AI returned unsafe content and the response was discarded'
    : message, statusCode);
}

async function getCaseConversation(caseId) {
  const result = await pool.query(
    `SELECT id, sender_type, message, created_at
     FROM (
       SELECT id, sender_type, message, created_at
       FROM case_conversations
       WHERE case_id = $1
       ORDER BY created_at DESC
       LIMIT 20
     ) recent
     ORDER BY created_at ASC`,
    [caseId]
  );
  return result.rows;
}

function aiCaseData(caseRecord) {
  const history = caseRecord.structured_history || {};
  return {
    ...history,
    chief_complaint: caseRecord.chief_complaint,
    chiefComplaint: caseRecord.chief_complaint,
    complaint: caseRecord.chief_complaint,
    preferredLanguage: history.preferredLanguage || history.preferred_language || history.language || null,
    language: history.language || history.preferredLanguage || history.preferred_language || null,
    status: caseRecord.status,
    structured_history: history,
    doctor_notes: caseRecord.doctor_notes || null
  };
}

function intakeQuestionPlan(chiefComplaint) {
  const complaint = String(chiefComplaint || '').toLowerCase();
  const questions = [
    { id: 'duration', section: 'Symptoms Detailed', text: 'How long have you been experiencing this problem?' },
    { id: 'severity', section: 'Symptoms Detailed', text: 'How severe are the symptoms: mild, moderate, or severe?' }
  ];

  if (/fever|temperature/.test(complaint)) questions.push({ id: 'temperature', section: 'Symptoms Detailed', text: 'Have you measured your temperature? If yes, what was it?' });
  if (/cough/.test(complaint)) questions.push({ id: 'cough_type', section: 'Symptoms Detailed', text: 'Is the cough dry, or are you bringing up mucus?' });
  if (/headache|head pain/.test(complaint)) questions.push({ id: 'headache_features', section: 'Symptoms Detailed', text: 'Where is the headache located, and did it start suddenly or gradually?' });
  if (/abdominal|stomach|belly/.test(complaint)) questions.push({ id: 'pain_location', section: 'Symptoms Detailed', text: 'Where exactly is the pain located, and did it start suddenly or gradually?' });
  if (/rash|skin|itch/.test(complaint)) questions.push({ id: 'rash_features', section: 'Symptoms Detailed', text: 'Where is the skin problem located, and is it itchy, painful, or spreading?' });

  questions.push(
    { id: 'associated_symptoms', section: 'Symptoms Detailed', text: 'Are there any other symptoms you have noticed?' },
    { id: 'medical_history', section: 'Medical History', text: 'Do you have any medical conditions or previous health problems we should know about?' },
    { id: 'medication_history', section: 'Active Medications', text: 'Are you taking any regular medicines or supplements?' },
    { id: 'allergy_history', section: 'Active Medications', text: 'Do you have any medicine, food, or other allergies?' }
  );
  return questions;
}

function nextIntakeQuestion(caseRecord, patientMessage) {
  const history = caseRecord.structured_history || {};
  const existingState = history.intake_state || {};
  const askedQuestionIds = Array.isArray(existingState.askedQuestionIds)
    ? existingState.askedQuestionIds.filter((id) => typeof id === 'string')
    : ['language', 'chiefComplaint'];
  const answers = { ...(existingState.answers || {}) };
  const previousId = existingState.lastQuestionId || 'chiefComplaint';
  if (patientMessage && previousId) answers[previousId] = patientMessage.trim();

  const plan = intakeQuestionPlan(caseRecord.chief_complaint);
  const next = plan.find((question) => !askedQuestionIds.includes(question.id)) || null;
  const nextAsked = next ? [...askedQuestionIds, next.id] : askedQuestionIds;
  return {
    next,
    state: {
      askedQuestionIds: nextAsked,
      lastQuestionId: next ? next.id : null,
      answers
    }
  };
}

async function persistIntakeState(caseId, state, preferredLanguage) {
  await pool.query(
    `UPDATE patient_cases
     SET structured_history = COALESCE(structured_history, '{}'::jsonb) || $1::jsonb
     WHERE id = $2`,
    [JSON.stringify({ intake_state: state, preferredLanguage, language: preferredLanguage }), caseId]
  );
}

async function saveInformation(caseRecord, information, urgency) {
  const structuredHistory = {
    ...(caseRecord.structured_history || {}),
    ...information,
    ai_information: information
  };
  await pool.query(
    `UPDATE patient_cases
     SET structured_history = $1,
         urgent_flag = CASE WHEN $2 = 'urgent' THEN TRUE ELSE urgent_flag END,
         urgent_message = CASE WHEN $2 = 'urgent' THEN $3 ELSE urgent_message END
     WHERE id = $4`,
    [structuredHistory, urgency, safetyMessage, caseRecord.id]
  );
  if (urgency === 'urgent' && caseRecord.doctor_id) {
    const doctor = await pool.query('SELECT user_id FROM doctors WHERE id = $1', [caseRecord.doctor_id]);
    if (doctor.rows[0]) await safeCreateNotification({
      recipientUserId: doctor.rows[0].user_id,
      type: 'urgent_case',
      title: 'Urgent case requires attention',
      message: safetyMessage,
      caseId: caseRecord.id,
      dedupeKey: `urgent_case:${caseRecord.id}`
    });
  }
}

function languageState(preferredLanguage) {
  return {
    nextQuestion: 'What problem are you experiencing?',
    informationCollected: {},
    missingInformation: ['chief complaint'],
    isComplete: false,
    urgency: 'normal',
    currentSection: 'Chief Complaint',
    completedSections: ['Personal Info'],
    progress: 15,
    preferredLanguage
  };
}

function normalizeLanguage(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized.includes('hindi') || normalized.includes('हिंदी')) return 'Hindi';
  if (normalized.includes('english')) return 'English';
  return value && String(value).trim().slice(0, 50) || 'English';
}

function isAiUnavailable(error) {
  return error instanceof GeminiServiceError && error.code === 'AI_UNAVAILABLE';
}

function patientStatements(conversation = []) {
  return conversation
    .filter((item) => item && item.sender_type === 'patient' && typeof item.message === 'string')
    .map((item) => item.message.trim())
    .filter(Boolean);
}

function fallbackQuestion(caseData = {}, conversation = [], preferredLanguage = 'English') {
  const statements = patientStatements(conversation);
  const history = caseData.structured_history || {};
  const steps = [
    ['Symptoms Detailed', 'How long have you been experiencing these symptoms?', []],
    ['Symptoms Detailed', 'How severe are the symptoms: mild, moderate, or severe?', ['Chief Complaint']],
    ['Medical History', 'Do you have any relevant medical conditions, allergies, or recent treatments?', ['Chief Complaint', 'Symptoms Detailed']],
    ['Active Medications', 'Are you taking any regular medications or supplements?', ['Chief Complaint', 'Symptoms Detailed', 'Medical History']]
  ];
  const step = steps[Math.min(statements.length, steps.length - 1)];
  const isComplete = statements.length >= 5;
  const completedSections = isComplete
    ? ['Personal Info', 'Chief Complaint', 'Symptoms Detailed', 'Medical History', 'Active Medications', 'Reports Sync']
    : ['Personal Info', ...step[2]];

  return {
    nextQuestion: isComplete ? null : step[1],
    informationCollected: {
      ...history,
      chiefComplaint: caseData.chief_complaint || statements[0] || null,
      patientStatements: statements
    },
    missingInformation: isComplete ? [] : ['Additional details for clinical review'],
    isComplete,
    urgency: 'unknown',
    currentSection: isComplete ? 'Reports Sync' : step[0],
    completedSections,
    progress: isComplete ? 100 : Math.round((completedSections.length / 6) * 100),
    redFlags: [],
    preferredLanguage,
    generatedBy: 'safe_fallback'
  };
}

function fallbackSummary(caseData = {}, conversation = []) {
  const history = caseData.structured_history || {};
  const statements = patientStatements(conversation);
  const chiefComplaint = caseData.chief_complaint || statements[0] || null;
  const symptomSource = history.symptoms || chiefComplaint;
  const symptoms = Array.isArray(symptomSource)
    ? symptomSource.map(String)
    : typeof symptomSource === 'string' && symptomSource.trim()
      ? [symptomSource.trim()]
      : [];

  return {
    chiefComplaint,
    historyOfPresentIllness: statements.length
      ? `Patient-reported information: ${statements.join(' ')}`
      : 'Patient-reported information is not yet available.',
    symptoms,
    medicalHistory: Array.isArray(history.medical_history) ? history.medical_history : [],
    medications: Array.isArray(history.medication_history) ? history.medication_history : [],
    allergies: Array.isArray(history.allergy_history) ? history.allergy_history : [],
    familyHistory: Array.isArray(history.family_history) ? history.family_history : [],
    lifestyleHistory: Array.isArray(history.lifestyle_history) ? history.lifestyle_history : [],
    importantFindings: ['This is a patient-reported, preliminary case summary requiring clinical evaluation.'],
    missingInformation: ['Clinical examination and clinician review'],
    redFlags: [],
    followUpQuestions: ['Please clarify any symptom changes, relevant history, and current medications.'],
    clinicalObservations: ['No diagnosis has been made by this tool.'],
    possibleConsiderations: ['The reported symptoms require clinical evaluation by a qualified healthcare professional.'],
    suggestedNextSteps: ['Review this summary with a clinician and seek urgent care if symptoms become severe or rapidly worsen.'],
    urgency: 'unknown',
    summary: chiefComplaint
      ? `Preliminary patient-reported case summary for: ${chiefComplaint}. Clinical evaluation is required.`
      : 'Preliminary patient-reported case summary. Clinical evaluation is required.',
    generatedBy: 'safe_fallback'
  };
}

async function saveSummary(caseId, summary) {
  await pool.query(
    `UPDATE patient_cases
     SET ai_summary = $1,
         urgent_flag = CASE WHEN $2 = 'urgent' THEN TRUE ELSE urgent_flag END,
         urgent_message = CASE WHEN $2 = 'urgent' THEN $3 ELSE urgent_message END
     WHERE id = $4`,
    [summary, summary.urgency, safetyMessage, caseId]
  );
  if (summary.urgency === 'urgent') {
    const doctor = await pool.query(
      `SELECT d.user_id FROM patient_cases pc JOIN doctors d ON d.id = pc.assigned_doctor_id WHERE pc.id = $1`,
      [caseId]
    );
    if (doctor.rows[0]) await safeCreateNotification({
      recipientUserId: doctor.rows[0].user_id,
      type: 'urgent_case',
      title: 'Urgent case requires attention',
      message: safetyMessage,
      caseId,
      dedupeKey: `urgent_case:${caseId}`
    });
  }
}

router.post('/ai/next-question', authenticate, authorizeRoles('patient', 'doctor', 'admin'), async (request, response, next) => {
  const validationError = validInput(request.body);
  if (validationError) return failure(response, validationError, 400);
  try {
    if (request.body.stage === 'language_selection') {
      const preferredLanguage = normalizeLanguage(request.body.preferredLanguage || request.body.answer);
      const result = languageState(preferredLanguage);
      result.nextQuestion = await translateQuestion(result.nextQuestion, preferredLanguage);
      return success(response, result);
    }
    const result = await generateNextQuestion(request.body.caseData || {}, request.body.conversation || []);
    return success(response, result);
  } catch (error) {
    if (isAiUnavailable(error)) return success(response, fallbackQuestion(request.body.caseData || {}, request.body.conversation || [], normalizeLanguage(request.body.preferredLanguage)));
    return aiFailure(error, response, next);
  }
});

router.post('/ai/generate-summary', authenticate, authorizeRoles('patient', 'doctor', 'admin'), async (request, response, next) => {
  const validationError = validInput(request.body);
  if (validationError) return failure(response, validationError, 400);
  try {
    const result = await generateCaseSummary(request.body.caseData || {}, request.body.conversation || []);
    return success(response, result);
  } catch (error) {
    if (isAiUnavailable(error)) return success(response, fallbackSummary(request.body.caseData || {}, request.body.conversation || []));
    return aiFailure(error, response, next);
  }
});

router.post('/cases/:id/ai-question', authenticate, authorizeRoles('patient', 'doctor'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  const message = request.body && request.body.message;
  const preferredLanguage = normalizeLanguage(request.body && request.body.preferredLanguage);
  if (message !== undefined && (typeof message !== 'string' || !message.trim() || message.length > 5000)) {
    return failure(response, 'message must be a non-empty string of at most 5000 characters', 400);
  }
  if (request.body && (request.body.sender_type !== undefined || request.body.sender_user_id !== undefined)) {
    return failure(response, 'Sender identity is determined by authentication', 400);
  }

  let caseRecord;
  try {
    caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    if (message !== undefined) {
      await pool.query(
        `INSERT INTO case_conversations (case_id, sender_type, sender_user_id, message)
         VALUES ($1, $2, $3, $4)`,
        [caseRecord.id, request.user.role, request.user.id, message.trim()]
      );
    }
    const conversation = await getCaseConversation(caseRecord.id);
    const question = await generateNextQuestion(aiCaseData(caseRecord), conversation);
    const intake = nextIntakeQuestion(caseRecord, message);
    question.nextQuestion = intake.next ? intake.next.text : null;
    question.currentSection = intake.next ? intake.next.section : 'Reports Sync';
    question.isComplete = !intake.next;
    question.completedSections = question.isComplete
      ? ['Personal Info', 'Chief Complaint', 'Symptoms Detailed', 'Medical History', 'Active Medications', 'Reports Sync']
      : question.completedSections;
    question.progress = question.isComplete ? 100 : Math.round((intake.state.askedQuestionIds.length / 10) * 100);
    question.preferredLanguage = preferredLanguage;
    await saveInformation(caseRecord, question.informationCollected, question.urgency);
    await pool.query(
      `UPDATE patient_cases SET structured_history = COALESCE(structured_history, '{}'::jsonb) || $1::jsonb WHERE id = $2`,
      [JSON.stringify({ preferredLanguage, currentSection: question.currentSection, completedSections: question.completedSections, progress: question.progress }), caseRecord.id]
    );
    await persistIntakeState(caseRecord.id, intake.state, preferredLanguage);
    if (question.nextQuestion) {
      await pool.query(
        `INSERT INTO case_conversations (case_id, sender_type, message, ai_metadata)
         VALUES ($1, 'ai', $2, $3)`,
        [caseRecord.id, question.nextQuestion, { type: 'follow_up_question', urgency: question.urgency }]
      );
    }
    return success(response, question);
  } catch (error) {
    if (isAiUnavailable(error)) {
      const fallback = fallbackQuestion(aiCaseData(caseRecord), await getCaseConversation(caseRecord.id), preferredLanguage);
      const intake = nextIntakeQuestion(caseRecord, message);
      fallback.nextQuestion = intake.next ? intake.next.text : null;
      fallback.currentSection = intake.next ? intake.next.section : 'Reports Sync';
      fallback.isComplete = !intake.next;
      fallback.progress = fallback.isComplete ? 100 : Math.round((intake.state.askedQuestionIds.length / 10) * 100);
      await saveInformation(caseRecord, fallback.informationCollected, fallback.urgency);
      await pool.query(
        `UPDATE patient_cases SET structured_history = COALESCE(structured_history, '{}'::jsonb) || $1::jsonb WHERE id = $2`,
        [JSON.stringify({ preferredLanguage, currentSection: fallback.currentSection, completedSections: fallback.completedSections, progress: fallback.progress }), caseRecord.id]
      );
      await persistIntakeState(caseRecord.id, intake.state, preferredLanguage);
      if (fallback.nextQuestion) {
        await pool.query(
          `INSERT INTO case_conversations (case_id, sender_type, message, ai_metadata)
           VALUES ($1, 'ai', $2, $3)`,
          [caseRecord.id, fallback.nextQuestion, { type: 'follow_up_question', generatedBy: 'safe_fallback' }]
        );
      }
      return success(response, fallback);
    }
    return aiFailure(error, response, next);
  }
});

router.post('/cases/:id/generate-summary', authenticate, authorizeRoles('patient', 'doctor', 'admin'), async (request, response, next) => {
  if (!validCaseId(request.params.id)) return failure(response, 'Invalid case ID', 400);
  let caseRecord;
  try {
    caseRecord = await getAuthorizedCase(request.params.id, request.user);
    if (!caseRecord) return failure(response, 'Case not found or access denied', 404);
    const summary = await generateCaseSummary(aiCaseData(caseRecord), await getCaseConversation(caseRecord.id));
    await saveSummary(caseRecord.id, summary);
    return success(response, summary);
  } catch (error) {
    if (isAiUnavailable(error)) {
      const summary = fallbackSummary(aiCaseData(caseRecord), await getCaseConversation(caseRecord.id));
      await saveSummary(caseRecord.id, summary);
      return success(response, summary);
    }
    return aiFailure(error, response, next);
  }
});

module.exports = router;
