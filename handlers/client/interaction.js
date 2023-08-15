const { sendEmbedMessage } = require('../../functions/embeds');

module.exports = async (client, interaction, commands) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  const command = commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    // Send an error message as an embed with red color
    sendEmbedMessage(interaction.channel, `An error occurred while executing the command: ${error.message}`, '#FF0000');
  }
};
