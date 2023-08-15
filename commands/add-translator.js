const { sendEmbedMessage, getRandomColor } = require('../functions/embeds');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const premiumUsersPath = path.join(__dirname, '../config/premiumusers.json'); // Path to premium users JSON

const channelIdConfigPath = path.join(__dirname, '../config/channelid.json');

module.exports = {
  data: {
    name: 'add-translator',
    description: 'Add the translation channel for the bot.',
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
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      const errorMessage = 'You do not have the required permissions to use this command.';
      sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
      return;
    }

    const mainChannelId = interaction.options.getChannel('main-channel').id;
    const translationChannelId = interaction.options.getChannel('translation-channel').id;

    // Read the translation channel IDs from the JSON file
    try {
      const channelIdConfig = require(channelIdConfigPath);

      if (channelIdConfig[mainChannelId]) {
        const errorMessage = 'A translation channel is already set for the specified main channel.';
        sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
        return;
      }

      // Check if the user is a premium user
      const premiumUsers = require(premiumUsersPath);
      const userId = interaction.user.id;
      const isPremiumUser = premiumUsers.includes(userId);

      // Check if the user is trying to add more than 3 channels and is not a premium user
      if (Object.keys(channelIdConfig).length >= 3 && !isPremiumUser) {
        const premiumMessage = 'You have reached the maximum limit of 3 channels. Consider upgrading to premium.';
        sendEmbedMessage(interaction, premiumMessage, '#FFA500', config.footerText, true);
        return;
      }

      channelIdConfig[mainChannelId] = translationChannelId;
      fs.writeFileSync(channelIdConfigPath, JSON.stringify(channelIdConfig, null, 2));

      const embedMessage = {
        title: 'Translator Channel Added',
        description: `The translation channel has been set for the main channel with ID: ${mainChannelId}.`,
        color: isPremiumUser ? '#FFA500' : getRandomColor(),
        footer: {
          text: config.footerText,
        },
        timestamp: new Date(),
      };

      interaction.reply({
        embeds: [embedMessage],
        ephemeral: false,
      });
    } catch (error) {
      console.error('Error updating translation channel IDs:', error);
      const errorMessage = 'An error occurred while adding the translation channel. Please try again later.';
      sendEmbedMessage(interaction, errorMessage, '#FF0000', config.footerText, true);
    }
  },
};
