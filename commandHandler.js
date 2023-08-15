const { Client, Collection } = require('discord.js');
const fs = require('fs');

const commands = new Collection();

function loadCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.data.name, command);
  }
}

module.exports = { commands, loadCommands };
