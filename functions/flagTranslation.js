const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const langdetect = require('langdetect');
const franc = require('franc-all');
const cld = require('cld');
const {
  isValidEmoji,
  getLanguagesFromEmoji,
} = require('country-emoji-languages');
const config = require('../config.json');
const flagEmojiList = require('../config/flagemojilist.json');

const settingsFilePath = '../config/flag-translation-settings.json';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

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

async function translateText(translationData) {
  const apiUrl = config.apiUrl;
  const response = await fetch(`${apiUrl}?from=${translationData.from}&to=${translationData.to}&text=${encodeURIComponent(translationData.text)}`);
  const data = await response.json();
  if (!data.status) {
    throw new Error('Translation failed.');
  }
  return data.translated;
}

async function detectMessageLanguage(text) {
  let langDetectResult = langdetect.detectOne(text);
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

function getFlagLanguage(emojiName) {
  const flagInfo = flagEmojiList.languages.find((lang) => lang.emoji === emojiName);
  return flagInfo ? flagInfo.code : 'Unknown';
}

async function handleFlagTranslation(reaction, user) {
  if (!reaction.message.guild) {
    return;
  }

  const message = reaction.message;
  const reactedEmoji = reaction.emoji.name;

  if (!isValidEmoji(reactedEmoji)) {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setDescription('Unsupported flag emoji. Please use a valid flag emoji.')
      .setFooter(config.footerText);

    const errorMessage = await message.reply({ embeds: [errorEmbed] });

    setTimeout(() => {
      errorMessage.delete();
    }, 10000);
    return;
  }

  const languages = getLanguagesFromEmoji(reactedEmoji);
  if (languages.length === 0) {
    const errorEmbed = new MessageEmbed()
      .setColor('RED')
      .setDescription('Unsupported flag emoji. Please use a valid flag emoji.')
      .setFooter(config.footerText);

    const errorMessage = await message.reply({ embeds: [errorEmbed] });

    setTimeout(() => {
      errorMessage.delete();
    }, 10000); // Delete the error message after 10 seconds
    return;
  }

  const languageCode = languages[0];

  const messageLanguage = await detectMessageLanguage(message.content);
  const flagLanguage = getFlagLanguage(reactedEmoji);

  const absoluteSettingsFilePath = path.resolve(__dirname, settingsFilePath);

  try {
    const rawSettings = fs.readFileSync(absoluteSettingsFilePath, 'utf8');
    const settings = JSON.parse(rawSettings);

    const guildId = message.guild.id;
    if (settings[guildId] && settings[guildId].status === 'enable') {
      const userPermissions = settings[guildId].permissions;

      const originalContent = message.content;

      let detectedLanguage;
      try {
        detectedLanguage = await detectLanguage(originalContent);
        if (Array.isArray(detectedLanguage) && detectedLanguage.length > 0) {
          detectedLanguage = detectedLanguage[0].lang;
        }
      } catch (error) {
        console.error('Error while detecting language:', error);
        return;
      }

      const translationData = {
        from: detectedLanguage || 'auto',
        to: flagLanguage,
        text: originalContent,
        multi: true,
      };

      try {
        const translatedText = await translateText(translationData);

        if (translatedText) {
          const embedColor = getRandomColor();
          const embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('Translation Result')
            .setFooter(config.footerText)
            .addFields(
              { name: 'Original Text', value: originalContent, inline: false },
              { name: 'Translated Text', value: translatedText, inline: false }
            );

          await message.reply({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error while translating:', error);
      }
    }
  } catch (error) {
    console.error('Error while reading settings file:', error);
  }
}

function registerReactionEvent(client) {

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
  detectMessageLanguage,
  translateText,
  handleFlagTranslation,
  registerReactionEvent,
};
