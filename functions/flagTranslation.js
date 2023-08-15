const { MessageEmbed } = require('discord.js');
const supportedLanguages = require('../config/langsupport.json');
const langdetect = require('langdetect');
const franc = require('franc-all');
const cld = require('cld');
const fetch = require('node-fetch');
const config = require('../config.json');
const fs = require('fs');

const settingsFilePath = '../config/flag-translation-settings.json';
const flagEmojiList = require('../config/flagemojilist.json');

// Helper function to generate random color in hexadecimal format
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Helper function to get the ISO-639 language code from the country name
function getLanguageCode(country) {
  const countryInfo = supportedLanguages.find((info) => info.Country === country);
  if (countryInfo) {
    return countryInfo['ISO-639 code'];
  }
  return null;
}

// Helper function to get the country name from the flag emoji
function getCountryFromEmoji(emojiName) {
  const emojiInfo = flagEmojiList.languages.find((info) => info.emoji === emojiName);
  if (emojiInfo) {
    return emojiInfo["Country code"];
  }
  return null;
}

// Function to detect language using langdetect, franc-all, and cld
async function detectLanguage(text) {
  const langDetectResult = langdetect.detect(text);
  if (langDetectResult) {
    return langDetectResult;
  }

  const francAllResult = franc.all(text);
  if (francAllResult.length > 0) {
    return francAllResult[0].code;
  }

  return new Promise((resolve, reject) => {
    cld.detect(text, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.languages[0].code);
      }
    });
  });
}

// Function to translate text using the custom Google Translate API
async function translateText(translationData) {
  const apiUrl = config.apiUrl;
  const response = await fetch(`${apiUrl}?from=${translationData.from}&to=${translationData.to}&text=${encodeURIComponent(translationData.text)}`);
  const data = await response.json();
  if (!data.status) {
    throw new Error('Translation failed.');
  }
  return data.translated;
}

// Function to check if the user has the required permission level for flag translation
function hasPermission(user, guild, requiredPermission) {
  // Implement your permission logic here based on the requiredPermission argument.
  // For example, check user roles, server ownership, etc.
  // Return true if the user has the required permission level; otherwise, return false.
  // For the sake of this example, we assume everyone has permission for simplicity.
  return true;
}

// Function to handle the flag translation
async function handleFlagTranslation(reaction, user) {
  console.log('Reaction handler is running.');

  if (!reaction.message.guild) {
    return; // Ignore reactions in direct messages
  }

  const message = reaction.message;
  const reactedEmoji = reaction.emoji.identifier;

  // URL-decode the emoji identifier
  const decodedEmoji = decodeURIComponent(reactedEmoji);

  // Check if the emoji exists in the flag emoji list
  const flagData = getFlagData(decodedEmoji);
  if (!flagData) {
    console.log('Not a valid flag emoji:', decodedEmoji);
    return;
  }

  // Get the country name and language code from the flag emoji
  const country = flagData["Country code"];
  const languageCode = getLanguageCode(country);

  if (!languageCode) {
    console.log(`Language code not found for country: ${country}`);
    return;
  }

  console.log('Reaction received:', decodedEmoji);
  console.log('Country:', country);
  console.log('Language code:', languageCode);
  
  // Load the settings from the JSON file
  const settings = fs.existsSync(settingsFilePath) ? JSON.parse(fs.readFileSync(settingsFilePath)) : {};
  const guildSettings = settings[message.guild.id] || {};

  // Check if flag translation is enabled for the guild
  if (guildSettings.status !== 'enable') {
    console.log('Flag translation is not enabled for this guild.');
    return;
  }

  // Check if the user has the required permission level for flag translation
  if (!hasPermission(user, message.guild, guildSettings.permissions)) {
    console.log(`User ${user.username} does not have permission to use flag translation.`);
    return;
  }

  const originalContent = message.content;

  // Language detection using langdetect, franc-all, and cld
  let detectedLanguage;
  try {
    detectedLanguage = await detectLanguage(originalContent);
    console.log('Detected language:', detectedLanguage);
  } catch (error) {
    console.error('Error while detecting language:', error);
    // You can send an error message as an embed or a regular message here if needed
    return;
  }

  const translationData = {
    from: detectedLanguage || 'auto', // If language detection fails, use 'auto'
    to: languageCode,
    text: originalContent,
    multi: true,
  };

  console.log('Translation data:', translationData);

  try {
    const translatedText = await translateText(translationData);
    console.log('Translated text:', translatedText);

    const embedColor = getRandomColor();
    const embed = new MessageEmbed()
      .setColor(embedColor)
      .setDescription(translatedText)
      .setFooter(config.footerText)
      .addField('Original Language', detectedLanguage || 'Unknown', true)
      .addField('Target Language', country, true);

    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error while translating:', error);
    // You can send an error message as an embed or a regular message here if needed
  }
}

// Function to register the messageReactionAdd event
function registerReactionEvent(client) {
  console.log('Registering messageReactionAdd event.');

  client.on('messageReactionAdd', async (reaction, user) => {
    try {
      console.log('Reaction added:', reaction.emoji.name, 'by', user.username);
      await handleFlagTranslation(reaction, user);
    } catch (error) {
      console.error(error);
    }
  });
}

module.exports = {
  getRandomColor,
  detectLanguage,
  translateText,
  handleFlagTranslation,
  registerReactionEvent,
};
