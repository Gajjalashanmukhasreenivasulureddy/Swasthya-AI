const env = require('../config/env');

class MultilingualServiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'MultilingualServiceError';
    this.code = code;
  }
}

function romanHindi(text) {
  const translations = new Map([
    ['What problem are you experiencing?', 'Aapko kya problem ho rahi hai?'],
    ['Which language would you like to continue in?', 'Aap kis bhasha mein jaari rakhna chahenge?'],
    ['When did this problem begin, and how would you describe its severity?', 'Yeh problem kab shuru hui, aur aap iski severity kaise batayenge?'],
    ['When did the headache begin, and was its onset sudden or gradual?', 'Sir dard kab shuru hua, aur kya yeh achanak ya dheere-dheere shuru hua?'],
    ['Have you noticed vomiting, vision changes, weakness, numbness, or sensitivity to light?', 'Kya aapko ulti, nazar mein badlav, kamzori, sunnpan ya roshni se takleef hui hai?'],
    ['What temperature did you record, and when did the fever begin?', 'Aapne kitna temperature note kiya, aur bukhar kab shuru hua?'],
    ['Where exactly is the abdominal pain, and when did it start?', 'Pet mein dard bilkul kahan hai, aur yeh kab shuru hua?'],
    ['Is the pain related to meals, vomiting, diarrhea, constipation, or urinary symptoms?', 'Kya dard khane, ulti, dast, kabz ya peshab ki dikkat se juda hai?'],
    ['How long have the respiratory symptoms been present, and is the cough dry or producing sputum?', 'Saans se judi takleef kitne samay se hai, aur kya khansi sukhi hai ya balgam aa raha hai?'],
    ['Do you have fever, chest pain, wheezing, breathlessness, smoking exposure, or a relevant respiratory history?', 'Kya aapko bukhar, seene mein dard, seeti jaisi saans, saans phoolna, dhumrapan ka exposure ya saans ki koi purani bimari hai?'],
    ['Are you experiencing chills, cough, sore throat, pain, vomiting, diarrhea, rash, or urinary symptoms?', 'Kya aapko thand lagna, khansi, gale mein dard, ulti, dast, daane ya peshab ki dikkat hai?'],
    ['Does the discomfort spread to your arm, jaw, back, or come with sweating or faintness?', 'Kya takleef haath, jabde ya peeth tak jaati hai, ya pasina aur behoshi jaisa lagta hai?'],
    ['When did the chest discomfort begin, and is it severe or associated with breathing difficulty?', 'Seene mein takleef kab shuru hui, aur kya yeh tez hai ya saans lene mein dikkat ke saath hai?']
  ]);
  return translations.get(text) || text;
}

function extractText(payload) {
  return payload?.translatedText || payload?.translated_text || payload?.text || payload?.output || payload?.result?.text || payload?.result?.translatedText;
}

async function translateQuestion(text, preferredLanguage) {
  if (!preferredLanguage || preferredLanguage.toLowerCase() === 'english') return text;
  if (!env.multilingualApiUrl) {
    if (preferredLanguage.toLowerCase() === 'hindi') return romanHindi(text);
    return text;
  }

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (env.multilingualApiKey) headers.Authorization = `Bearer ${env.multilingualApiKey}`;
    const response = await fetch(env.multilingualApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text,
        source_language: 'English',
        target_language: preferredLanguage,
        output_style: preferredLanguage.toLowerCase() === 'hindi' ? 'Roman Hindi (Latin characters only)' : 'natural spoken language'
      })
    });
    if (!response.ok) throw new Error(`Translation API returned ${response.status}`);
    const translated = extractText(await response.json());
    if (typeof translated !== 'string' || !translated.trim()) throw new Error('Translation API returned no text');
    if (preferredLanguage.toLowerCase() === 'hindi' && /[\u0900-\u097f]/.test(translated)) {
      throw new Error('Translation API returned Devanagari instead of Roman Hindi');
    }
    return translated.trim();
  } catch (error) {
    console.error('Multilingual provider error:', error.message);
    if (preferredLanguage.toLowerCase() === 'hindi') return romanHindi(text);
    throw new MultilingualServiceError('TRANSLATION_UNAVAILABLE', 'The multilingual service is temporarily unavailable');
  }
}

module.exports = { MultilingualServiceError, translateQuestion };