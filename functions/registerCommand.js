const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { clientId } = require('../config.json');
require('dotenv').config();

// Require all the slash command modules from the 'commands/' folder
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.push(command.data);
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

module.exports = {
  async registerSlashCommands(translations) {
    try {
      console.log('Started refreshing application (/) commands.');

      // Register the slash commands globally with Discord API
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  },
};
