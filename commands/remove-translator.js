const { sendEmbedMessage, getRandomColor } = require('../functions/embeds');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const channelIdConfigPath = path.join(__dirname, '../config/channelid.json');

module.exports = {
  data: {
    name: 'remove-translator',
    description: 'Remove the translation channel for the bot.',
    options: [
      {
        name: 'main-channel',
        description: 'The main channel with the translator.',
        type: 7,
        required: true,
      },
      {
        name: 'translation-channel',
        description: 'The translation channel for the main channel.',
        type: 7,
        required: true,
      },
    ],
  },
  async execute(interaction) {
    // Check if the user invoking the command is an administrator
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const errorMessage = 'You do not have the required permissions to use this command.';
      sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
      return;
    }

    const mainChannelId = interaction.options.getChannel('main-channel').id;
    const translationChannelId = interaction.options.getChannel('translation-channel').id;

    console.log('Main Channel ID:', mainChannelId);
    console.log('Translation Channel ID:', translationChannelId);

    // Read the translation channel IDs from the JSON file
    try {
      const channelIdConfig = require(channelIdConfigPath);
      console.log('Stored Channel IDs:', channelIdConfig);

      // Check if the main channel ID exists in the channelIdConfig object
      if (!channelIdConfig[String(mainChannelId)]) {
        const errorMessage = 'No translation channel is set for the specified main channel.';
        sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
        return;
      }

      // Check if the specified translation channel matches the stored value in the channelIdConfig
      if (channelIdConfig[String(mainChannelId)] !== String(translationChannelId)) {
        const errorMessage = 'The specified translation channel does not match the stored value for the main channel.';
        sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
        return;
      }

      // Remove the translation channel ID for the main channel
      delete channelIdConfig[String(mainChannelId)];

      // Save the updated translation channel IDs back to the JSON file
      fs.writeFileSync(channelIdConfigPath, JSON.stringify(channelIdConfig, null, 2));

      const embedMessage = {
        title: 'Translator Channel Removed',
        description: `The translation channel for the main channel with ID: ${mainChannelId} has been removed.`,
        color: getRandomColor(),
        footer: {
          text: config.footerText,
        },
      };

      interaction.reply({
        embeds: [embedMessage],
        ephemeral: false,
      });
    } catch (error) {
      console.error('Error reading or writing translation channel IDs:', error);
      const errorMessage = 'An error occurred while removing the translation channel. Please try again later.';
      sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
    }
  },
};
