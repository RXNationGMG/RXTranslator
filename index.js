const { Client, Intents } = require('discord.js');
const { registerSlashCommands } = require('./functions/registerCommand');
const { sendEmbedMessage, getRandomColor } = require('./functions/embeds');
const translations = require('./config/langsupport.json');
const config = require('./config.json');

// Define the intents the bot requires
const intents = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS, // Correct intent for reaction events
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

const { registerReactionEvent } = require('./functions/flagTranslation');
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

// Register the messageReactionAdd event listener
client.on('messageReactionAdd', async (reaction, user) => {
  // Check if the reaction was added to a message the bot sent
  if (!user.bot && reaction.message.author.id === client.user.id) {
    const emoji = reaction.emoji.name; // Get the emoji name (e.g., "🇵🇭")

    // Find the corresponding country object from the updated flagEmojiList using the emoji
    const countryData = flagEmojiList.languages.find((country) => country.emoji === emoji);

    if (countryData) {
      const { Language, "ISO-639 code": code } = countryData;
      // Do something with the language name and ISO-639 code, e.g., use it to translate the message or perform an action
      console.log(`${user.tag} reacted with ${emoji}, which represents ${Language} (${code}).`);
    }
  }
});

// Login to Discord using the token from .env
client.login(process.env.DISCORD_TOKEN);