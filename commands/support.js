const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

// Function to generate random color in hexadecimal format
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription(`Get RXTranslator's invite link`),
  async execute(interaction) {
    // Discord bot invite link
    const botInviteLink = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&scope=bot&permissions=0`;
    // Discord support server invite link
    const supportServerInvite = config.supportServerInvite;

    const embed = new MessageEmbed()
      .setColor(getRandomColor()) // Random color for each embed
      .setTitle('RXTranslator Support & Invite Links')
      .setDescription(
        `Invite Me To Your Discord Server: [Click Here](${botInviteLink})\nJoin Our Support Server: [Click Here](${supportServerInvite})`
      )
      .setFooter(config.footerText) // Use the footer text from the config file
      .setAuthor({
        name: interaction.guild.me.displayName, // Bot's display name in the server
        iconURL: interaction.guild.me.displayAvatarURL(), // Bot's avatar URL
      });

    interaction.reply({ embeds: [embed] });
  },
};
