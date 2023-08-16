const { Client, Collection } = require('discord.js');
const fs = require('fs');

// Create a collection to store commands
const commands = new Collection();

/**
 * Load commands from command files in the ./commands directory
 */
function loadCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.data.name, command);
  }
}

// Export the commands collection and the loadCommands function
module.exports = { commands, loadCommands };
