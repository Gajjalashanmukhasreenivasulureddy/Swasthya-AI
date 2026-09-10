const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');

const MODEL = 'gemini-3.6-flash';
const MAX_CONTEXT_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const urgencyValues = new Set(['normal', 'urgent', 'unknown']);

class GeminiServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'GeminiServiceError';
    this.code = code;
  }
}

function getClient() {
  if (!env.geminiApiKey) {
    throw new GeminiServiceError('AI_NOT_CONFIGURED', 'Gemini AI is not configured');
  }
  return new GoogleGenAI({ apiKey: env.geminiApiKey });
}

function boundedConversation(conversation) {
  if (!Array.isArray(conversation)) return [];
  return conversation.slice(-MAX_CONTEXT_MESSAGES).map((item) => ({
    sender: typeof item.sender_type === 'string' ? item.sender_type : 'unknown',
    message: typeof item.message === 'string' ? item.message.slice(0, MAX_MESSAGE_LENGTH) : '',
    timestamp: item.created_at || undefined
  }));
}

function safeJson(value) {
  if (typeof value !== 'string') throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned no text');
  const withoutFence = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(withoutFence);
  } catch (error) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid JSON');
  }
}

function responseText(response) {
  return typeof response.text === 'function' ? response.text() : response.text;
}

function containsUnsafeAdvice(text) {
  return /\b(diagnos(?:e|is|ed)?|prescrib(?:e|ed|ing)?|dosage|take\s+\d+\s*(?:mg|ml|tablet|pill))/i.test(text);
}

function validateInformation(information) {
  if (!information || typeof information !== 'object' || Array.isArray(information)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid collected information');
  }
  const arrayFields = [
    'symptoms',
    'associatedSymptoms',
    'medicalHistory',
    'medications',
    'allergies',
    'familyHistory',
    'lifestyleHistory'
  ];
  for (const field of arrayFields) {
    if (information[field] !== undefined && !Array.isArray(information[field])) {
      throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid structured information');
    }
  }
  return information;
}

function validateNextQuestion(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned an invalid next-question response');
  }
  if (result.nextQuestion !== null && !isNonEmptyText(result.nextQuestion, 1000)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned an invalid question');
  }
  if (result.informationCollected !== undefined) validateInformation(result.informationCollected);
  if (!Array.isArray(result.missingInformation)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid missing information');
  }
  if (typeof result.isComplete !== 'boolean' || !urgencyValues.has(result.urgency)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid completion metadata');
  }
  if (result.nextQuestion && containsUnsafeAdvice(result.nextQuestion)) {
    throw new GeminiServiceError('AI_UNSAFE_RESPONSE', 'Gemini returned unsafe medical advice');
  }
  return {
    nextQuestion: result.nextQuestion,
    informationCollected: result.informationCollected || {},
    missingInformation: result.missingInformation,
    isComplete: result.isComplete,
    urgency: result.urgency
  };
}

function isNonEmptyText(value, maximumLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maximumLength;
}

function validateSummary(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned an invalid summary');
  }
  const textFields = ['chiefComplaint', 'historyOfPresentIllness'];
  for (const field of textFields) {
    if (result[field] !== undefined && result[field] !== null && !isNonEmptyText(result[field], 10000)) {
      throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid summary text');
    }
  }
  const arrayFields = [
    'symptoms',
    'medicalHistory',
    'medications',
    'allergies',
    'familyHistory',
    'lifestyleHistory',
    'importantFindings',
    'missingInformation'
  ];
  for (const field of arrayFields) {
    if (!Array.isArray(result[field])) {
      throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid summary structure');
    }
  }
  if (!urgencyValues.has(result.urgency)) {
    throw new GeminiServiceError('AI_INVALID_RESPONSE', 'Gemini returned invalid summary urgency');
  }
  const text = [result.chiefComplaint, result.historyOfPresentIllness, ...result.importantFindings].join(' ');
  if (containsUnsafeAdvice(text)) {
    throw new GeminiServiceError('AI_UNSAFE_RESPONSE', 'Gemini returned unsafe medical advice');
  }
  return {
    chiefComplaint: result.chiefComplaint || null,
    historyOfPresentIllness: result.historyOfPresentIllness || null,
    symptoms: result.symptoms,
    medicalHistory: result.medicalHistory,
    medications: result.medications,
    allergies: result.allergies,
    familyHistory: result.familyHistory,
    lifestyleHistory: result.lifestyleHistory,
    importantFindings: result.importantFindings,
    missingInformation: result.missingInformation,
    urgency: result.urgency
  };
}

async function generateJson(prompt) {
  let response;
  try {
    response = await getClient().models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    });
  } catch (error) {
    if (error instanceof GeminiServiceError) throw error;
    throw new GeminiServiceError('AI_UNAVAILABLE', 'Gemini is temporarily unavailable');
  }
  return safeJson(responseText(response));
}

function buildContext(caseData, conversation) {
  return JSON.stringify({
    case: caseData || {},
    conversation: boundedConversation(conversation)
  });
}

async function generateNextQuestion(caseData, conversation) {
  const prompt = `You are Swasthya, a medical history and case-taking assistant supporting a licensed doctor.
Your only job is to collect patient-reported information. Do not diagnose, name likely diseases, prescribe medication, recommend dosages, or claim certainty. If information suggests possible immediate danger, set urgency to "urgent" and say the patient should seek immediate professional or emergency medical attention; do not explain a diagnosis.

The complaint may be any symptom or combination of symptoms. Dynamically choose the most relevant missing history based on the complaint and prior answers. Ask exactly ONE concise follow-up question, and do not repeat information already provided. If enough information is collected, set nextQuestion to null and isComplete to true.

Return JSON only with exactly this shape:
{"nextQuestion":"string or null","informationCollected":{"chiefComplaint":null,"symptoms":[],"duration":null,"onset":null,"severity":null,"location":null,"frequency":null,"associatedSymptoms":[],"medicalHistory":[],"medications":[],"allergies":[],"familyHistory":[],"lifestyleHistory":[]},"missingInformation":[],"isComplete":false,"urgency":"normal|urgent|unknown"}
Only include information supported by the case or conversation. Keep unknown values null or empty arrays.

Input context:
${buildContext(caseData, conversation)}`;
  return validateNextQuestion(await generateJson(prompt));
}

async function generateCaseSummary(caseData, conversation) {
  const prompt = `You are Swasthya, a medical history and case-taking assistant preparing information for a doctor.
Create a concise structured summary from only the patient-reported case and conversation. Do not diagnose, prescribe medication, recommend dosages, or invent findings. If potentially urgent symptoms are described, set urgency to "urgent" and include immediate professional or emergency medical attention in importantFindings without naming a diagnosis. Otherwise use "normal" or "unknown".

Return JSON only with exactly this shape:
{"chiefComplaint":null,"historyOfPresentIllness":null,"symptoms":[],"medicalHistory":[],"medications":[],"allergies":[],"familyHistory":[],"lifestyleHistory":[],"importantFindings":[],"missingInformation":[],"urgency":"normal|urgent|unknown"}
Missing information must remain missing. Do not infer facts.

Input context:
${buildContext(caseData, conversation)}`;
  return validateSummary(await generateJson(prompt));
}

module.exports = {
  GeminiServiceError,
  generateNextQuestion,
  generateCaseSummary
};