const { SlashCommandBuilder } = require('@discordjs/builders');
const langSupport = require('../config/langsupport.json');
const { MessageEmbed } = require('discord.js');
const { getRandomColor } = require('../functions/embeds');

const ITEMS_PER_PAGE = 10;

async function generatePageEmbed(page, totalPages, client, interaction) {
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const embed = new MessageEmbed()
    .setTitle('Supported Languages for Translation')
    .setColor(getRandomColor())
    .setFooter(`Page ${page} of ${totalPages}`)
    .setTimestamp(new Date())
    .setAuthor({
      name: interaction.member.displayName, // Member's display name
      iconURL: interaction.user.displayAvatarURL(), // Member's avatar URL
    });

  langSupport.slice(startIndex, endIndex).forEach(({ Language, 'ISO-639 code': code }) => {
    const languageExists = client.translations.getLanguages().includes(code.toLowerCase());
    embed.addField(Language, languageExists ? '✅' : '❌', true);
  });

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translatorsupport')
    .setDescription('Displays a list of supported languages for translation.')
    .addIntegerOption(option => option.setName('page').setDescription('The page number to display (default: 1 | Max: 14)')),
  async execute(interaction) {
    try {
      const page = interaction.options?.get('page')?.value || 1;
      const totalLanguages = langSupport.length;
      const totalPages = Math.ceil(totalLanguages / ITEMS_PER_PAGE);

      // Acknowledge the interaction
      await interaction.deferReply({ ephemeral: true });

      // For the initial command interaction
      const embed = await generatePageEmbed(page, totalPages, interaction.client, interaction);
      
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp({ content: 'An error occurred while processing the command.', ephemeral: false });
    }
  },
};
