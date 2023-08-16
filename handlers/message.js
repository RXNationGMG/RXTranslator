const { Client, TextChannel, MessageEmbed } = require('discord.js');
const { sendEmbedMessage, getRandomColor } = require('../functions/embeds');
const { translateText } = require('../functions/translate');
const path = require('path');
const fs = require('fs');
const wanakana = require('wanakana');

const channelIdConfigPath = path.join(__dirname, '../config/channelid.json');

module.exports = async (client, message, config, commands, translations) => {
  if (message.author.bot) return;

  // Load the 'add-translator' command
  const addTranslatorCommand = require('../commands/add-translator.js');
  commands.set(addTranslatorCommand.data.name, addTranslatorCommand);

  // Function to get the translation channel IDs from the JSON file
  function getTranslationChannelIds() {
    try {
      const channelIdConfig = require(channelIdConfigPath);
      return channelIdConfig || {};
    } catch (error) {
      console.error('Error reading translation channel IDs:', error);
      return {};
    }
  }

  // Regular expression to detect links in the message content
  const linkRegex = /https?:\/\/\S+/gui;

  // Regular expression to detect Discord emojis in the message content
  const emojiRegex = /<a?:[a-zA-Z0-9_]+:\d+>|[\u2000-\u3300]+/gui;

  // Check if the message content contains links or Discord emojis
  if (linkRegex.test(message.content) || emojiRegex.test(message.content)) return;

  let content = message.content.trim();
  if (content.length === 0) return;

  // Declare the mainTranslationChannelId variable outside the try-catch block
  let mainTranslationChannelId;

  try {
    if (hasJapaneseCharacters(content)) {
      content = wanakana.toRomaji(content);
    }

    // Detect the language of the message using the "translateText" function
    const detectedLanguage = await translateText(content);

    // If the detected language is not English, proceed with translation
    if (detectedLanguage !== 'en') {
      const translationChannelIds = getTranslationChannelIds();
      mainTranslationChannelId = translationChannelIds[message.channel.id];

      if (!mainTranslationChannelId) {
        console.error('The main translation channel is not set in the config for the given channel ID:', message.channel.id);
        return;
      }

      // Check if the message is from any of the translation channels
      if (message.channel.id !== mainTranslationChannelId && !Object.values(translationChannelIds).includes(message.channel.id)) {
        return; // Exit early if the message is not from any of the translation channels
      }

      const translation = await translateText(content);

      // Check if the translated message is empty before sending it to the translation channel
      if (translation.trim().length === 0) {
        console.error('The translated message is empty.');
        return; // Exit early if the translated message is empty
      }

      const translationChannel = client.channels.cache.get(mainTranslationChannelId);

      if (translationChannel instanceof TextChannel) {
        // Send the translated message to the assigned translation channel
        const translatedMessageEmbed = new MessageEmbed()
          .setColor(getRandomColor())
          .setDescription(`Message: 
          ${message.content}
          \nTranslated Message: 
          ${translation}`)
          .setFooter(config.footerText)
          .setAuthor(message.member.displayName, message.author.avatarURL());

        translationChannel.send({ embeds: [translatedMessageEmbed] });
      } else {
        console.error('The translation channel is not a text channel or could not be found.');
      }
    } else {
      // If the message is in English, no need to translate.
      if (message.channel.id === mainTranslationChannelId) {
        // Send the message only if it is from the main translation channel
        const englishMessageEmbed = new MessageEmbed()
          .setColor(getRandomColor())
          .setDescription('The message is in English, no need to translate.')
          .setFooter(config.footerText);

        message.channel.send({ embeds: [englishMessageEmbed] });
      }
    }
  } catch (error) {
    console.error('Error translating:', error);

    // Send the error message to the specific channel using the custom embed function
    const errorChannelId = ''; // Replace this with the desired channel ID
    const errorChannel = client.channels.cache.get(errorChannelId);
    if (errorChannel instanceof TextChannel) {
      const errorMessage = 'An error occurred while translating the message.';

      const { MessageEmbed } = require('discord.js');
      const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setAuthor(client.user.username, client.user.displayAvatarURL()) 
        .setDescription(errorMessage)
        .setFooter(config.footerText);

      errorChannel.send({ embeds: [embed] }).catch(console.error);
    } else {
      console.error('The error channel is not a text channel or could not be found.');
    }
  }
};

// Helper function to check if the string has Japanese characters
function hasJapaneseCharacters(str) {
  const japaneseRegex = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF]/;
  return japaneseRegex.test(str);
}
