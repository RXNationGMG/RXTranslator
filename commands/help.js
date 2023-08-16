const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { sendEmbedMessage, getRandomColor } = require('../functions/embeds');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show the full commands from RXTranslator'),
  async execute(interaction) {
    const commands = [
      {
        name: 'add-translator',
        description: 'To add the translation channels (limited languages | limit: 3 for non-premium users)',
        usage: '/add-translator `main-channel:` #channel-name `translation-channel:` #translation-channel',
      },
      {
        name: 'flag_translation',
        description: 'To translate messages through Flags',
        usage: '/flag_translation `status:` Enable',
      },
      {
        name: 'help',
        description: 'To show the full commands from RXTranslator',
        usage: '/help',
      },
      {
        name: 'ping',
        description: "To show the bot's current ping and server ping",
        usage: '/ping',
      },
      {
        name: 'remove-translator',
        description: 'To remove the translator channel',
        usage: '/remove-translator `main-channel:` #channel-name `translation-channel:` #translation-channel',
      },
      {
        name: 'support',
        description: "To show the bot's support server and the invite link",
        usage: '/support',
      },
            {
        name: 'translate',
        description: 'To translate text to another language',
        usage: '/translate `text:` text-here `to:` the-language `from:` the-language',
      },
      {
        name: 'translatorsupport',
        description: 'To show how many languages can be supported (limited languages can be translated)',
        usage: '/translatorsupport `1-14`',
      },
    ];

    const helpEmbed = new MessageEmbed()
      .setColor(getRandomColor())
      .setAuthor(interaction.client.user.username, interaction.client.user.displayAvatarURL())
      .setTitle(`RXTranslator's Commands`)
      .setDescription('Here is a list of available commands and their usage:');

    commands.forEach((cmd) => {
      helpEmbed.addField(`**${cmd.name}**`, `**Description:** ${cmd.description}\n**Usage:** ${cmd.usage}`);
    });

    // Add the footer message from the config
    helpEmbed.setFooter({ text: config.footerText });

    try {
      await sendEmbedMessage(interaction, helpEmbed);
    } catch (error) {
      console.error('Error while sending help message:', error);
    }
  },
};
