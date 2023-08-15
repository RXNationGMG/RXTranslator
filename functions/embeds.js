const { MessageEmbed } = require('discord.js');

// Function to generate random color in hexadecimal format
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function sendEmbedMessage(interaction, content, color) {
  const embed = new MessageEmbed()
    .setColor(color || getRandomColor());

  if (typeof content === 'string') {
    // If the content is a string, set it as the description of the embed
    embed.setDescription(content);
  } else if (typeof content === 'object') {
    // If the content is an object (such as a MessageEmbed), merge its properties with the current embed
    Object.assign(embed, content);
  }

  try {
    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('Error while sending embed message:', error);
  }
}

module.exports = {
  getRandomColor,
  sendEmbedMessage,
};
