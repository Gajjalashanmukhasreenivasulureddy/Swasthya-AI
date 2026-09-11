const { GoogleGenAI } = require("@google/genai");
const env = require("../config/env");
const {
  translateQuestion,
  MultilingualServiceError,
} = require("./multilingual.service");

const sections = [
  "Personal Info",
  "Chief Complaint",
  "Symptoms Detailed",
  "Medical History",
  "Active Medications",
  "Reports Sync",
];

class GeminiServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "GeminiServiceError";
    this.code = code;
  }
}

function getClient() {
  const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new GeminiServiceError(
      "AI_NOT_CONFIGURED",
      "Gemini AI is not configured"
    );
  }

  return new GoogleGenAI({ apiKey });
}

const SUPPORTED_LANGUAGES = [
  "english",
  "hindi",
  "bengali",
  "tamil",
  "telugu",
  "marathi",
  "gujarati",
  "kannada",
  "malayalam",
  "punjabi",
  "urdu",
];

function detectLanguage(text) {
  if (!text || typeof text !== "string") return null;

  const value = text.trim().toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(value)) {
    return value;
  }

  const aliases = {
    "हिंदी": "hindi",
    "हिन्दी": "hindi",
    bangla: "bengali",
    বাংলা: "bengali",
    தமிழ்: "tamil",
    తెలుగు: "telugu",
    मराठी: "marathi",
    ગુજરાતી: "gujarati",
    ಕನ್ನಡ: "kannada",
    മലയാളം: "malayalam",
    ਪੰਜਾਬੀ: "punjabi",
    اردو: "urdu",
  };

  return aliases[value] || null;
}

function getMessageText(item) {
  if (!item) return "";

  if (typeof item.message === "string") {
    return item.message.trim();
  }

  if (typeof item.content === "string") {
    return item.content.trim();
  }

  return "";
}

function getSender(item) {
  return String(
    item?.sender_type ||
      item?.sender ||
      item?.role ||
      ""
  ).toLowerCase();
}

function conversationContext(conversation) {
  if (!Array.isArray(conversation)) return [];

  return conversation.slice(-30).map((item) => ({
    sender: getSender(item) || "unknown",
    message: getMessageText(item).slice(0, 3000),
  }));
}

function getLastUserMessage(conversation) {
  if (!Array.isArray(conversation)) return "";

  for (let i = conversation.length - 1; i >= 0; i--) {
    const sender = getSender(conversation[i]);

    if (
      sender === "user" ||
      sender === "patient" ||
      sender === "human"
    ) {
      const message = getMessageText(conversation[i]);

      if (message) return message;
    }
  }

  return "";
}

function getLastAssistantMessage(conversation) {
  if (!Array.isArray(conversation)) return "";

  for (let i = conversation.length - 1; i >= 0; i--) {
    const sender = getSender(conversation[i]);

    if (
      sender === "assistant" ||
      sender === "ai" ||
      sender === "bot"
    ) {
      const message = getMessageText(conversation[i]);

      if (message) return message;
    }
  }

  return "";
}

function extractComplaint(conversation, caseData = {}) {
  const existing =
    caseData.chiefComplaint ||
    caseData.complaint ||
    caseData.chief_complaint;

  if (
    typeof existing === "string" &&
    existing.trim()
  ) {
    return existing.trim();
  }

  if (!Array.isArray(conversation)) {
    return null;
  }

  /*
   * Look for the patient's answer after the assistant asks
   * "What problem are you experiencing?"
   */
  for (let i = 0; i < conversation.length; i++) {
    const assistantText = getMessageText(conversation[i])
      .toLowerCase();

    if (
      getSender(conversation[i]) === "assistant" &&
      (
        assistantText.includes("what problem") ||
        assistantText.includes("experiencing")
      )
    ) {
      const next = conversation[i + 1];

      if (
        next &&
        (
          getSender(next) === "user" ||
          getSender(next) === "patient" ||
          getSender(next) === "human"
        )
      ) {
        const answer = getMessageText(next);

        if (
          answer &&
          !detectLanguage(answer)
        ) {
          return answer;
        }
      }
    }
  }

  return null;
}

function isLanguageQuestion(question) {
  if (typeof question !== "string") return false;

  const value = question
    .toLowerCase()
    .replace(/[?!.]/g, "");

  return (
    value.includes("which language") ||
    value.includes("what language") ||
    value.includes("language would you like") ||
    value.includes("preferred language")
  );
}

function normalizeQuestion(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wasAlreadyAsked(question, conversation) {
  if (!question || !Array.isArray(conversation)) {
    return false;
  }

  const target = normalizeQuestion(question);

  return conversation.some((item) => {
    const sender = getSender(item);

    if (
      sender !== "assistant" &&
      sender !== "ai" &&
      sender !== "bot"
    ) {
      return false;
    }

    return normalizeQuestion(
      getMessageText(item)
    ) === target;
  });
}

function fallbackQuestion(chiefComplaint) {
  const complaint = String(
    chiefComplaint || ""
  ).toLowerCase();

  if (/fever|temperature|febrile/.test(complaint)) {
    return "How long have you had the fever, and what was the highest temperature you measured?";
  }

  if (/cough|cold/.test(complaint)) {
    return "How long have you had the cough, and is it dry or producing sputum?";
  }

  if (/headache|migraine|head pain/.test(complaint)) {
    return "When did the headache start, and how severe is it?";
  }

  if (
    /stomach|abdominal|abdomen|belly/.test(
      complaint
    )
  ) {
    return "When did the abdominal pain start, and where exactly do you feel it?";
  }

  if (
    /chest pain|chest tightness/.test(
      complaint
    )
  ) {
    return "When did the chest pain start, and how severe is it?";
  }

  if (
    /breathing|breath|shortness of breath/.test(
      complaint
    )
  ) {
    return "When did the breathing difficulty start, and is it getting worse?";
  }

  if (
    /rash|itch|skin|patch/.test(
      complaint
    )
  ) {
    return "When did the skin problem start, and has it been spreading or changing?";
  }

  if (
    /vomit|vomiting|nausea/.test(
      complaint
    )
  ) {
    return "When did the nausea or vomiting start, and how often is it happening?";
  }

  if (
    /diarrhea|loose motion/.test(
      complaint
    )
  ) {
    return "When did the diarrhea start, and how many times have you had it today?";
  }

  if (
    /dizz|vertigo|gidd/.test(
      complaint
    )
  ) {
    return "When did the dizziness start, and does it happen continuously or in episodes?";
  }

  if (
    /urine|urinary|urination|pee/.test(
      complaint
    )
  ) {
    return "When did the urinary symptoms start, and are you having any pain or fever?";
  }

  return "When did this problem start, and how has it changed since then?";
}

function parseJson(value) {
  if (typeof value !== "string") {
    throw new GeminiServiceError(
      "AI_INVALID_RESPONSE",
      "Gemini returned an invalid response"
    );
  }

  let text = value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(
      "Invalid Gemini JSON:",
      text
    );

    throw new GeminiServiceError(
      "AI_INVALID_RESPONSE",
      "Gemini returned invalid JSON"
    );
  }
}

function calculateProgress(
  completedSections = []
) {
  const completed = new Set(
    Array.isArray(completedSections)
      ? completedSections.filter((section) =>
          sections.includes(section)
        )
      : []
  );

  return Math.min(
    100,
    Math.round(
      (completed.size / sections.length) * 100
    )
  );
}

function normalizeResult(result, caseData) {
  if (
    !result ||
    typeof result !== "object" ||
    Array.isArray(result)
  ) {
    throw new GeminiServiceError(
      "AI_INVALID_RESPONSE",
      "Gemini returned invalid case state"
    );
  }

  const question =
    result.nextQuestion ||
    result.question ||
    null;

  const completedSections =
    Array.isArray(result.completedSections)
      ? result.completedSections.filter((section) =>
          sections.includes(section)
        )
      : [];

  const currentSection =
    sections.includes(result.currentSection)
      ? result.currentSection
      : "Chief Complaint";

  return {
    nextQuestion:
      typeof question === "string" &&
      question.trim()
        ? question.trim()
        : null,

    informationCollected: {
      ...(caseData || {}),
      ...(result.informationCollected ||
        result.caseData ||
        {}),
    },

    missingInformation:
      Array.isArray(result.missingInformation)
        ? result.missingInformation
        : [],

    isComplete: Boolean(
      result.isComplete ??
        result.caseComplete ??
        false
    ),

    urgency:
      result.urgency ||
      (
        Array.isArray(result.redFlags) &&
        result.redFlags.length
          ? "urgent"
          : "normal"
      ),

    currentSection,

    completedSections,

    progress:
      calculateProgress(
        completedSections
      ),

    redFlags:
      Array.isArray(result.redFlags)
        ? result.redFlags
        : [],
  };
}

async function generateJson(prompt) {
  try {
    const response = await getClient().models.generateContent({
      // IMPORTANT: use a real/current Gemini model
      model:
        process.env.GEMINI_MODEL ||
        "gemini-2.5-flash",

      contents: prompt,

      config: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    });

    const text =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    if (!text || !String(text).trim()) {
      throw new GeminiServiceError(
        "AI_INVALID_RESPONSE",
        "Gemini returned an empty response"
      );
    }

    return parseJson(text);

  } catch (error) {
    console.error(
      "Gemini request failed:",
      error?.message || error
    );

    if (error instanceof GeminiServiceError) {
      throw error;
    }

    throw new GeminiServiceError(
      "AI_UNAVAILABLE",
      "Gemini is temporarily unavailable"
    );
  }
}

function medicalPrompt(
  caseData,
  conversation,
  preferredLanguage
) {
  return `
You are Swasthya, an AI-assisted medical
history-taking assistant used by a doctor.

Your job is ONLY to collect and structure
medical history.

You are NOT an autonomous doctor.

NEVER:
- diagnose with certainty
- prescribe medicine
- recommend dosages
- invent patient information

PATIENT LANGUAGE:
${preferredLanguage}

CURRENT CASE:
${JSON.stringify(caseData)}

CONVERSATION:
${JSON.stringify(
  conversationContext(conversation)
)}

IMPORTANT RULES:

1. NEVER assume the complaint is cough.

2. The patient can have ANY complaint:
fever, cough, headache, stomach pain,
chest pain, rash, vomiting, diarrhea,
dizziness, weakness, urinary problems,
breathing problems, injuries, or anything else.

3. Use information already provided.

4. NEVER ask for information the patient
has already provided.

5. Ask ONLY ONE question at a time.

6. NEVER ask the language question again.
The preferred language is already:

${preferredLanguage}

7. The patient's latest answer is the most
important new information.

8. Determine the next useful piece of medical
history to collect.

9. If the patient's complaint is known,
continue with relevant questions about:
duration, severity, associated symptoms,
medical history, medications, allergies,
and relevant red flags.

10. If an urgent red flag appears, include it
in redFlags.

11. Do not diagnose the red flag.

RETURN ONLY JSON:

{
  "nextQuestion": "one question",
  "informationCollected": {},
  "missingInformation": [],
  "isComplete": false,
  "urgency": "normal",
  "currentSection": "Chief Complaint",
  "completedSections": [],
  "redFlags": []
}
`;
}

async function generateNextQuestion(
  caseData = {},
  conversation = []
) {
  let preferredLanguage =
    caseData.preferredLanguage ||
    caseData.language ||
    null;

  /*
   * STEP 1
   * Recover language from conversation.
   */
  if (!preferredLanguage) {
    preferredLanguage =
      detectLanguage(
        getLastUserMessage(conversation)
      );
  }

  /*
   * STEP 2
   * No language yet = ask once.
   */
  if (!preferredLanguage) {
    return {
      nextQuestion:
        "Which language would you like to continue in?",

      informationCollected:
        caseData,

      missingInformation: [
        "preferredLanguage",
      ],

      isComplete: false,

      urgency: "normal",

      currentSection:
        "Personal Info",

      completedSections: [],

      progress: 0,

      redFlags: [],

      preferredLanguage: null,
    };
  }

  preferredLanguage =
    String(preferredLanguage)
      .trim()
      .toLowerCase();

  /*
   * STEP 3
   * Recover complaint from conversation.
   *
   * This is the important fix.
   */
  const recoveredComplaint =
    extractComplaint(
      conversation,
      caseData
    );

  const effectiveCaseData = {
    ...(caseData || {}),
    preferredLanguage,

    ...(recoveredComplaint &&
    !caseData.chiefComplaint &&
    !caseData.complaint
      ? {
          chiefComplaint:
            recoveredComplaint,
        }
      : {}),
  };

  /*
   * STEP 4
   * If language exists but complaint
   * does not exist, ask the complaint question.
   */
  if (
    !effectiveCaseData.chiefComplaint &&
    !effectiveCaseData.complaint
  ) {
    const question =
      "What problem are you experiencing?";

    let translatedQuestion =
      question;

    try {
      translatedQuestion =
        await translateQuestion(
          question,
          preferredLanguage
        );
    } catch (error) {
      console.error(
        "Translation error:",
        error.message
      );
    }

    return {
      nextQuestion:
        translatedQuestion,

      informationCollected:
        effectiveCaseData,

      missingInformation: [
        "chiefComplaint",
      ],

      isComplete: false,

      urgency: "normal",

      currentSection:
        "Chief Complaint",

      completedSections: [],

      progress: 0,

      redFlags: [],

      preferredLanguage,
    };
  }

  /*
   * STEP 5
   * Gemini now receives the COMPLETE
   * current state and conversation.
   */
  const result =
    await generateJson(
      medicalPrompt(
        effectiveCaseData,
        conversation,
        preferredLanguage
      )
    );

  const normalized =
    normalizeResult(
      result,
      effectiveCaseData
    );

  /*
   * STEP 6
   * HARD SAFETY GUARD:
   * Gemini is NEVER allowed to return
   * the language question after language
   * has already been selected.
   */
  if (
    isLanguageQuestion(
      normalized.nextQuestion
    )
  ) {
    normalized.nextQuestion =
      fallbackQuestion(
        effectiveCaseData.chiefComplaint ||
          effectiveCaseData.complaint
      );
  }

  /*
   * STEP 7
   * Prevent duplicate questions.
   */
  if (
    normalized.nextQuestion &&
    wasAlreadyAsked(
      normalized.nextQuestion,
      conversation
    )
  ) {
    normalized.nextQuestion =
      fallbackQuestion(
        effectiveCaseData.chiefComplaint ||
          effectiveCaseData.complaint
      );
  }

  /*
   * STEP 8
   * Translate the final question.
   */
  if (normalized.nextQuestion) {
    try {
      normalized.nextQuestion =
        await translateQuestion(
          normalized.nextQuestion,
          preferredLanguage
        );
    } catch (error) {
      console.error(
        "Question translation error:",
        error.message
      );
    }
  }

  return {
    ...normalized,

    informationCollected: {
      ...effectiveCaseData,
      ...(normalized.informationCollected ||
        {}),
    },

    preferredLanguage,
  };
}

async function generateCaseSummary(
  caseData = {},
  conversation = []
) {
  const prompt = `
You are preparing a structured medical
history for a doctor.

Do NOT diagnose.
Do NOT prescribe.
Do NOT invent information.

CASE:
${JSON.stringify(caseData)}

CONVERSATION:
${JSON.stringify(
  conversationContext(conversation)
)}

RETURN ONLY JSON:

{
  "chiefComplaint": null,
  "historyOfPresentIllness": null,
  "symptoms": [],
  "medicalHistory": [],
  "medications": [],
  "allergies": [],
  "familyHistory": [],
  "lifestyleHistory": [],
  "importantFindings": [],
  "missingInformation": [],
  "redFlags": [],
  "followUpQuestions": [],
  "clinicalObservations": [],
  "possibleConsiderations": [],
  "suggestedNextSteps": [],
  "urgency": "normal",
  "summary": null
}
`;

  const result =
    await generateJson(prompt);

  const arrayFields = [
    "symptoms",
    "medicalHistory",
    "medications",
    "allergies",
    "familyHistory",
    "lifestyleHistory",
    "importantFindings",
    "missingInformation",
    "redFlags",
    "followUpQuestions",
    "clinicalObservations",
    "possibleConsiderations",
    "suggestedNextSteps",
  ];

  for (const field of arrayFields) {
    if (!Array.isArray(result[field])) {
      result[field] = [];
    }
  }

  if (
    typeof result.summary !== "string" ||
    !result.summary.trim()
  ) {
    result.summary =
      "A clinician should review the patient-reported information.";
  }

  return {
    ...result,
    urgency:
      result.urgency || "normal",
  };
}

module.exports = {
  GeminiServiceError,
  generateNextQuestion,
  generateCaseSummary,
};