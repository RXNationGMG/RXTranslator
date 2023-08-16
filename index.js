const { Client, Intents } = require('discord.js');
const { registerSlashCommands } = require('./functions/registerCommand');
const { sendEmbedMessage, getRandomColor } = require('./functions/embeds');
const translations = require('./config/langsupport.json');
const config = require('./config.json');

// Define the intents the bot requires
const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
];

const client = new Client({ intents });

// Register translations data on the client
client.translations = {
  getLanguages() {
    return translations.map(({ "ISO-639 code": code }) => code.toLowerCase());
  }
};

// Require the command handler and load the commands
const { commands, loadCommands } = require('./commandHandler');
loadCommands();

// Register the messageReactionAdd event listener
const { registerReactionEvent, flagToCountry } = require('./functions/flagTranslation');
registerReactionEvent(client); // Register the messageReactionAdd event

// Set up the ready event
const readyHandler = require('./handlers/client/ready.js');
client.once('ready', () => readyHandler(client, config.clientId, config, commands, translations));

// Set up the messageCreate event
const messageHandler = require('./handlers/message.js');
client.on('messageCreate', (message) => messageHandler(client, message, config, commands, translations, { sendEmbedMessage }));

// Require the interactionCreate handler
const interactionHandler = require('./handlers/client/interaction.js');
client.on('interactionCreate', (interaction) => interactionHandler(client, interaction, commands, translations));

// Require and initialize the Express server based on the configuration
if (config.expressServerEnabled) {
  const expressServer = require('./handlers/server/express.js');
  expressServer(config);
}

// Set up the messageReactionAdd event listener
client.on('messageReactionAdd', async (reaction, user) => {
  if (!user.bot && reaction.message.author.id === client.user.id) {
    const emoji = reaction.emoji.name;

    const countryCode = flagToCountry(emoji);

    if (countryCode) {
      const countryData = flagEmojiList.languages.find((country) => country["Country code"] === countryCode);
      if (countryData) {
        const { Language, "ISO-639 code": code } = countryData;
      }
    }
  }
});

// Login to Discord using the token from .env
client.login(process.env.DISCORD_TOKEN);
