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

/*
|--------------------------------------------------------------------------
| Gemini Client
|--------------------------------------------------------------------------
*/

function getClient() {
  const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new GeminiServiceError(
      "AI_NOT_CONFIGURED",
      "Gemini AI is not configured"
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
}

/*
|--------------------------------------------------------------------------
| Supported Languages
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Detect Language From First Answer
|--------------------------------------------------------------------------
*/

function detectLanguage(text) {
  if (!text || typeof text !== "string") return null;

  const value = text.trim().toLowerCase();

  for (const language of SUPPORTED_LANGUAGES) {
    if (value === language) return language;
  }

  const aliases = {
    "हिंदी": "hindi",
    "हिन्दी": "hindi",
    "bangla": "bengali",
    "বাংলা": "bengali",
    "தமிழ்": "tamil",
    "తెలుగు": "telugu",
    "मराठी": "marathi",
    "ગુજરાતી": "gujarati",
    "ಕನ್ನಡ": "kannada",
    "മലയാളം": "malayalam",
    "ਪੰਜਾਬੀ": "punjabi",
    "اردو": "urdu",
  };

  return aliases[value] || null;
}

/*
|--------------------------------------------------------------------------
| Conversation Normalization
|--------------------------------------------------------------------------
*/

function conversationContext(conversation) {
  if (!Array.isArray(conversation)) return [];

  return conversation.slice(-30).map((item) => ({
    sender:
      item.sender_type ||
      item.sender ||
      item.role ||
      "unknown",

    message:
      typeof item.message === "string"
        ? item.message.slice(0, 3000)
        : typeof item.content === "string"
        ? item.content.slice(0, 3000)
        : "",
  }));
}

/*
|--------------------------------------------------------------------------
| JSON Parser
|--------------------------------------------------------------------------
*/

function parseJson(value) {
  if (typeof value !== "string") {
    throw new GeminiServiceError(
      "AI_INVALID_RESPONSE",
      "Gemini returned an invalid response"
    );
  }

  let text = value.trim();

  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini returned invalid JSON:", text);

    throw new GeminiServiceError(
      "AI_INVALID_RESPONSE",
      "Gemini returned invalid JSON"
    );
  }
}

/*
|--------------------------------------------------------------------------
| Progress
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Current section is NOT automatically considered completed.
| A section becomes completed only when Gemini says so.
|--------------------------------------------------------------------------
*/

function calculateProgress(completedSections = []) {
  const completed = new Set(
    Array.isArray(completedSections)
      ? completedSections.filter((section) =>
          sections.includes(section)
        )
      : []
  );

  return Math.min(
    100,
    Math.round((completed.size / sections.length) * 100)
  );
}

/*
|--------------------------------------------------------------------------
| Normalize Gemini Result
|--------------------------------------------------------------------------
*/

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

  const currentSection = sections.includes(
    result.currentSection
  )
    ? result.currentSection
    : "Chief Complaint";

  const completedSections = Array.isArray(
    result.completedSections
  )
    ? result.completedSections.filter((section) =>
        sections.includes(section)
      )
    : [];

  const question =
    result.nextQuestion ||
    result.question ||
    null;

  if (
    question !== null &&
    (typeof question !== "string" ||
      !question.trim())
  ) {
    throw new GeminiServiceError(
      "AI_INVALID_RESPONSE",
      "Gemini returned an invalid question"
    );
  }

  return {
    nextQuestion: question,

    informationCollected:
      result.informationCollected ||
      result.caseData ||
      caseData ||
      {},

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
      (Array.isArray(result.redFlags) &&
      result.redFlags.length
        ? "urgent"
        : "unknown"),

    currentSection,

    completedSections,

    progress: calculateProgress(
      completedSections
    ),

    redFlags: Array.isArray(result.redFlags)
      ? result.redFlags
      : [],
  };
}

/*
|--------------------------------------------------------------------------
| Gemini JSON Request
|--------------------------------------------------------------------------
*/

async function generateJson(prompt) {
  try {
    const client = getClient();

    const response =
      await client.models.generateContent({
        model:
          env.geminiModel ||
          process.env.GEMINI_MODEL ||
          "gemini-3.6-flash",

        contents: prompt,

        config: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      });

    const text =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    return parseJson(text);
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    console.error(
      "Gemini provider error:",
      error.status ||
        error.code ||
        "unknown",
      error.message
    );

    throw new GeminiServiceError(
      "AI_UNAVAILABLE",
      "Gemini is temporarily unavailable"
    );
  }
}

/*
|--------------------------------------------------------------------------
| Medical AI Prompt
|--------------------------------------------------------------------------
*/

function medicalPrompt(
  caseData,
  conversation,
  preferredLanguage
) {
  return `
You are Swasthya, an AI-assisted medical history-taking assistant used by a doctor.

Your ONLY purpose is to collect structured medical history.

You are NOT an autonomous doctor.

DO NOT:
- diagnose the patient
- prescribe medication
- recommend dosages
- claim certainty
- invent patient information

==================================================
LANGUAGE
==================================================

The patient's preferred language is:

${preferredLanguage || "English"}

IMPORTANT:

Medical reasoning is language-independent.

The patient's answers may be:
- English
- Roman Hindi
- Hinglish
- another Indian language
- mixed language

Understand the meaning regardless of language.

The final question you generate should be a clear neutral question.
The backend will translate it using the multilingual service.

DO NOT generate Devanagari or another native script yourself.

==================================================
CASE TAKING
==================================================

Never assume the patient has cough.

Determine the actual complaint from the conversation.

The patient could have:
- fever
- cough
- headache
- abdominal pain
- chest pain
- vomiting
- diarrhea
- dizziness
- weakness
- breathing difficulty
- skin complaints
- urinary complaints
- injuries
- multiple complaints
- any other health problem

Ask exactly ONE relevant follow-up question at a time.

Do not repeat information already provided.

Questions should be focused and understandable.

==================================================
FIRST MEDICAL QUESTION
==================================================

After the language has been selected, the first medical question MUST be:

"What problem are you experiencing?"

==================================================
CASE SECTIONS
==================================================

Use these sections:

${JSON.stringify(sections)}

Move between sections based on the actual information collected.

Do not mark a section complete merely because it is the current section.

A section is completed only when enough relevant information has been collected.

==================================================
RED FLAGS
==================================================

If the patient mentions potentially urgent symptoms, include them in redFlags.

Examples:
- severe chest pain
- severe breathing difficulty
- loss of consciousness
- seizure
- severe bleeding
- sudden neurological symptoms
- severe allergic reaction

Do not diagnose the emergency condition.

==================================================
CURRENT CASE
==================================================

Case data:

${JSON.stringify(caseData || {})}

==================================================
CONVERSATION
==================================================

${JSON.stringify(
  conversationContext(conversation)
)}

==================================================
RETURN ONLY JSON
==================================================

Use exactly this structure:

{
  "nextQuestion": "one question or null",
  "informationCollected": {},
  "missingInformation": [],
  "isComplete": false,
  "urgency": "normal",
  "currentSection": "Chief Complaint",
  "completedSections": [],
  "redFlags": []
}

Do not include markdown.
Do not include explanations outside JSON.
`;
}

/*
|--------------------------------------------------------------------------
| MAIN: Generate Next Question
|--------------------------------------------------------------------------
*/

async function generateNextQuestion(
  caseData = {},
  conversation = []
) {
  /*
   * Support language stored in multiple possible places.
   */

  let preferredLanguage =
    caseData.preferredLanguage ||
    caseData.language ||
    null;

  /*
   * ---------------------------------------------------------------
   * LANGUAGE SELECTION
   * ---------------------------------------------------------------
   *
   * If no language exists yet, ask the language question.
   */

  if (!preferredLanguage) {
    const lastMessage =
      Array.isArray(conversation) &&
      conversation.length
        ? conversation[conversation.length - 1]
        : null;

    const possibleLanguage =
      lastMessage?.message ||
      lastMessage?.content ||
      null;

    const detected =
      detectLanguage(possibleLanguage);

    if (detected) {
      preferredLanguage = detected;
    }
  }

  /*
   * If still no language, ask language question.
   */

  if (!preferredLanguage) {
    return {
      nextQuestion:
        "Which language would you like to continue in?",

      informationCollected: caseData,

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

  /*
   * ---------------------------------------------------------------
   * NORMALIZE LANGUAGE
   * ---------------------------------------------------------------
   */

  preferredLanguage =
    preferredLanguage
      .toString()
      .trim()
      .toLowerCase();

  /*
   * ---------------------------------------------------------------
   * FIRST MEDICAL QUESTION
   * ---------------------------------------------------------------
   *
   * If the only thing we know is the language,
   * ask the patient's main problem.
   */

  const hasMedicalConversation =
    Array.isArray(conversation) &&
    conversation.some(
      (item) => {
        const message =
          item?.message ||
          item?.content ||
          "";

        return (
          typeof message === "string" &&
          message.trim().length > 0 &&
          !detectLanguage(message)
        );
      }
    );

  if (
    !hasMedicalConversation &&
    !caseData.chiefComplaint &&
    !caseData.complaint
  ) {
    const englishQuestion =
      "What problem are you experiencing?";

    let translatedQuestion =
      englishQuestion;

    try {
      translatedQuestion =
        await translateQuestion(
          englishQuestion,
          preferredLanguage
        );
    } catch (error) {
      console.error(
        "Initial translation failed:",
        error.message
      );

      /*
       * Hindi has a fallback inside multilingual.service.js.
       * For other languages, keep the English question
       * instead of crashing the case.
       */
    }

    return {
      nextQuestion: translatedQuestion,

      informationCollected: {
        ...caseData,
        preferredLanguage,
      },

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
   * ---------------------------------------------------------------
   * GEMINI MEDICAL REASONING
   * ---------------------------------------------------------------
   */

  const result = await generateJson(
    medicalPrompt(
      {
        ...caseData,
        preferredLanguage,
      },
      conversation,
      preferredLanguage
    )
  );

  const normalized = normalizeResult(
    result,
    caseData
  );

  /*
   * ---------------------------------------------------------------
   * TRANSLATE GEMINI QUESTION
   * ---------------------------------------------------------------
   */

  if (normalized.nextQuestion) {
    try {
      normalized.nextQuestion =
        await translateQuestion(
          normalized.nextQuestion,
          preferredLanguage
        );
    } catch (error) {
      /*
       * Don't kill the medical case if translation
       * temporarily fails.
       */

      console.error(
        "Question translation failed:",
        error.message
      );

      if (
        error instanceof MultilingualServiceError
      ) {
        /*
         * Keep the original question.
         */
      }
    }
  }

  return {
    ...normalized,
    preferredLanguage,
  };
}

/*
|--------------------------------------------------------------------------
| Case Summary
|--------------------------------------------------------------------------
*/

async function generateCaseSummary(
  caseData = {},
  conversation = []
) {
  const prompt = `
You are preparing a concise structured medical history
for a doctor.

Understand patient answers regardless of language.

Do NOT:
- diagnose
- prescribe
- invent information

Return JSON ONLY:

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
  "urgency": "normal"
}

CASE:

${JSON.stringify(caseData)}

CONVERSATION:

${JSON.stringify(
  conversationContext(conversation)
)}
`;

  const result = await generateJson(prompt);

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

  return {
    ...result,
    urgency:
      result.urgency || "unknown",
  };
}

module.exports = {
  GeminiServiceError,
  generateNextQuestion,
  generateCaseSummary,
};