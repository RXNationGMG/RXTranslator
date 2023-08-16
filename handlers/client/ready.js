const { registerSlashCommands } = require('../../functions/registerCommand');
const fetch = require('node-fetch');

module.exports = async (client, clientId, config, translations) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(config.statusText, { type: 'PLAYING' });

  // Call registerSlashCommands function and pass clientId and translations for global registration
  registerSlashCommands(clientId, translations);

  // GitHub version check
  const repoURL = 'https://api.github.com/repos/RXNationGMG/RXTranslator/releases/latest';

  try {
    const response = await fetch(repoURL);
    if (response.ok) {
      const data = await response.json();
      const latestVersion = data.tag_name;
      console.log(`Latest version available: ${latestVersion}`);
    } else {
      console.error('Error fetching GitHub repository information.');
    }
  } catch (error) {
    console.error('Error fetching GitHub repository information:', error);
  }
};
