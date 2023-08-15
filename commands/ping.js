const { SlashCommandBuilder } = require('@discordjs/builders');
const { getRandomColor } = require('../functions/embeds');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping the bot and the API'),
  async execute(interaction) {
    const botPing = Date.now() - interaction.createdTimestamp;
    const apiPing = interaction.client.ws.ping;

    // Create an embed with random color
    const embed = {
      color: getRandomColor(),
      description: `Bot Latency: ${botPing}ms\nAPI Latency: ${apiPing}ms`,
      footer: {
        text: config.footerText,
      },
      author: {
        name: `${interaction.client.user.username}'s Latency`,
        icon_url: interaction.client.user.displayAvatarURL(),
      },
    };

    // Send the embed as a reply to the interaction
    await interaction.reply({ embeds: [embed] });
  },
};
