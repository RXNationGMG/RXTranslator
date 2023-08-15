const fetch = require('node-fetch');
const cld = require('cld');
const francAll = require('franc-all');
const langdetect = require('langdetect');
const config = require('../config.json');

async function detectLanguageCld(text) {
  try {
    // Perform language detection using cld.detect
    const result = await cld.detect(text);
    const detectedLanguageCode = result.languages[0].code;
    return detectedLanguageCode;
  } catch (cldError) {
    console.error('Error detecting language using cld:', cldError);
    throw cldError;
  }
}

async function detectLanguageFrancAll(text) {
  try {
    // Use franc-all for language detection
    const francAllResult = francAll.all(text);
    const detectedLanguageCode = francAllResult[0][0];
    return detectedLanguageCode;
  } catch (francAllError) {
    console.error('Error detecting language using franc-all:', francAllError);
    throw francAllError;
  }
}

async function detectLanguageLangdetect(text) {
  try {
    // Use langdetect for language detection
    const detectedLanguageCode = langdetect.detectOne(text);
    return detectedLanguageCode;
  } catch (langdetectError) {
    console.error('Error detecting language using langdetect:', langdetectError);
    throw langdetectError;
  }
}

async function detectLanguageAll(text) {
  try {
    let detectedLanguage = await detectLanguageLangdetect(text);
    if (detectedLanguage === 'und') {
      detectedLanguage = await detectLanguageCld(text);
    }
    if (detectedLanguage === 'und') {
      detectedLanguage = await detectLanguageFrancAll(text);
    }
    return detectedLanguage;
  } catch (error) {
    console.error('Error detecting language:', error);
    throw error;
  }
}

async function translateText(text, to) {
  const from = await detectLanguageAll(text);

  if (from === 'und') {
    throw new Error('Unable to identify the language.');
  }

  const url = `${config.apiUrl}?from=${from}&to=en&text=${encodeURIComponent(text)}`;

  console.log("API Url:", url); // Debug URL

  const response = await fetch(url);
  const data = await response.json();
  console.log("API Response:", data); // Debug API response

  if (data.status && data.translated) {
    return data.translated;
  } else {
    throw new Error('Translation failed.');
  }
}

module.exports = {
  detectLanguageAll,
  translateText,
};