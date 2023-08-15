const { registerSlashCommands } = require('../../functions/registerCommand');

module.exports = (client, config) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(config.statusText, { type: 'PLAYING' });

  // Call registerSlashCommands function and pass clientId for global registration
  registerSlashCommands(config.clientId);
};
