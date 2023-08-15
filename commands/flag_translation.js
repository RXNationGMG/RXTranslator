const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const langSupport = require('../config/langsupport.json');
const langDetector = require('langdetect');
const franc = require('franc-all');
const cld = require('cld');
const fetch = require('node-fetch');

const settingsFilePath = './config/flag-translation-settings.json';

function loadSettings() {
  if (fs.existsSync(settingsFilePath)) {
    return JSON.parse(fs.readFileSync(settingsFilePath));
  }
  return {};
}

function saveSettings(settings) {
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}

module.exports = {
  data: {
    name: 'flag_translation',
    description: 'Enable or disable flag translation and set permissions (Beta Feature)',
    options: [
      {
        name: 'status',
        description: 'Enable or disable flag translation',
        type: 3,
        required: true,
        choices: [
          {
            name: 'Enable',
            value: 'enable',
          },
          {
            name: 'Disable',
            value: 'disable',
          },
        ],
      },
      {
        name: 'permissions',
        description: 'Set who can use flag translation',
        type: 3,
        required: false,
        choices: [
          {
            name: 'Everyone',
            value: 'everyone',
          },
          {
            name: 'Server Admins',
            value: 'admin',
          },
          {
            name: 'Server Owner',
            value: 'owner',
          },
          {
            name: 'Same As Server',
            value: 'same_as_server',
          },
          {
            name: 'None',
            value: 'none',
          },
        ],
      },
    ],
  },
  async execute(interaction) {
    // Check if this is an interaction command
    if (!interaction) return;

    // Check if the user running the command is the owner
    if (interaction.user.id !== '725260858028195892') {
      await interaction.reply({
        content: 'Only the owner can use this command.',
        ephemeral: true,
      });
      return;
    }

    // Get the values of the options
    const status = interaction.options.getString('status');
    let permissions = interaction.options.getString('permissions');

    // If no permissions option is selected and flag translation is being enabled, set it to 'everyone'
    if (!permissions && status === 'enable') {
      permissions = 'everyone';
    }

    // If no permissions option is selected and flag translation is being disabled, set it to 'none'
    if (!permissions && status === 'disable') {
      permissions = 'none';
    }

    // Load existing settings from the JSON file
    const settings = loadSettings();

    // Save the status and permissions to the settings object
    const guildId = interaction.guild.id;
    settings[guildId] = {
      status,
      permissions,
    };

    // Save the updated settings back to the JSON file
    saveSettings(settings);

    await interaction.reply({
      content: `Flag translation has been ${
        status === 'enable' ? 'enabled' : 'disabled'
      } with permissions set to "${permissions || 'Everyone'}".`,
      ephemeral: true,
    });
  },
};
