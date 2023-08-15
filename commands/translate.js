const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { sendEmbedMessage, getRandomColor } = require('../functions/embeds');
const config = require('../config.json');
const langSupport = require('../config/langsupport.json');
const langDetector = require('langdetect');
const franc = require('franc-all');
const cld = require('cld');
const fetch = require('node-fetch');

// Helper function to map input variations to ISO-639 language codes
function mapToISO639Code(input) {
  // Convert input to lowercase for case-insensitive matching
  const lowerInput = input.toLowerCase();

  // Check if the input exactly matches any ISO-639 code
  const exactMatch = langSupport.find((lang) => lang['ISO-639 code'].toLowerCase() === lowerInput);
  if (exactMatch) {
    return exactMatch['ISO-639 code'];
  }

  // Check if the input matches any language name or ISO-639 code partially
  const partialMatch = langSupport.find(
    (lang) => lang['Language'].toLowerCase().includes(lowerInput) || lang['ISO-639 code'].toLowerCase().includes(lowerInput)
  );
  if (partialMatch) {
    return partialMatch['ISO-639 code'];
  }

  // Return null if no match is found
  return null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text to another language')
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('The text to translate')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription('The target language to translate to')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('from')
        .setDescription('The source language to translate from')
        .setRequired(false)
    ),
  async execute(interaction) {
    // Get user information
    const userAvatar = interaction.user.displayAvatarURL({ format: 'png', dynamic: true });
    const userNickname = interaction.member.displayName;

    const text = interaction.options.getString('text');
    let to = interaction.options.getString('to');
    const from = interaction.options.getString('from');

    // Map the "to" input to the corresponding ISO-639 code
    const toISO639Code = mapToISO639Code(to);
    if (!toISO639Code) {
      const errorMessage = 'Invalid target language. Please provide a valid language name or ISO-639 code.';
      sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText);
      return;
    }

    // Perform language detection using multiple libraries
    let detectedFrom;
    try {
      detectedFrom = langDetector.detectOne(text) || franc(text) || cld.detect(text)?.languages[0]?.code;
      if (!detectedFrom) {
        detectedFrom = 'auto';
      }
    } catch (error) {
      console.error('Error while detecting language:', error);
      detectedFrom = 'auto';
    }

    // API Request
    const apiUrl = `${config.apiUrl}?from=${from || detectedFrom || 'auto'}&to=${toISO639Code}&text=${encodeURIComponent(text)}`;

    // Debug information
    console.log('API URL:', apiUrl);
    console.log('Language Detected:', detectedFrom);

    try {
      // Record the start time before making the API request
      const startTime = Date.now();

      // Make the API request to fetch the translation result
      const apiResponse = await fetch(apiUrl);
      const { status, translated } = await apiResponse.json();

      // Calculate the API latency by subtracting the start time from the current time
      const apiLatency = Date.now() - startTime;

      // Prepare the response embed
      const embed = new MessageEmbed()
        .setColor(getRandomColor())
        .setTitle('Translation Result')
        .setAuthor(userNickname, userAvatar) // Display user's Discord avatar and nickname on top
        .addField('Original Text', text)
        .addField('Translated Text', status ? translated : 'Translation Failed')
        .addField('Source Language', detectedFrom === 'auto' ? 'Auto-Detected' : detectedFrom)
        .addField('Target Language', to)
        .setFooter(`API Latency: ${apiLatency}ms | ${config.footerText}`);

      // Send the embed message with the translation result
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error while sending translation message:', error);
      const errorMessage = 'An error occurred while fetching the translation. Please try again later.';
      sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText);
    }
  },
};