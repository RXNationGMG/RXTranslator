const { registerSlashCommands } = require('../../functions/registerCommand');

module.exports = (client, clientId, config, translations) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(config.statusText, { type: 'PLAYING' });

  // Call registerSlashCommands function and pass clientId and translations for global registration
  registerSlashCommands(clientId, translations);
};
