# RXTranslator

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Code Claiming](#code-claiming)
- [Support and Community](#support-and-community)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Welcome to RXTranslator, the ultimate Discord bot for breaking down language barriers and enhancing communication on your server! Whether you're chatting with friends from around the globe, exploring foreign content, or just curious about different languages, RXTranslator has got you covered. Powered by advanced translation technology, this bot can seamlessly translate text and messages between a wide variety of languages, making multilingual interactions smooth and effortless.

## Features

- **Slash Commands Support:** RXTranslator supports Discord's latest slash commands, making it easy to access translation functionality with simple and intuitive commands.

- **Auto Language Detection:** No need to specify the source language! RXTranslator automatically detects the input language and provides accurate translations.

- **Flag Emoji Translator:** Want to have fun with flag emojis? Just use the bot to translate text into flag emojis representing different languages. (Beta)

- **Powerful API Integration:** RXTranslator utilizes the latest translation APIs to ensure accurate and reliable translations, supporting a vast range of languages.

- **Easy-to-Use Configuration:** Configure RXTranslator quickly with the `config.json` file, providing customization options to suit your server's needs.

- **Maintenance Mode:** Enable maintenance mode when necessary to temporarily pause the bot's operations without disrupting your server.

- **Customizable Status Text:** Show off your bot's origin with a customizable status text indicating "Made By RXNationGaming."

- **Extensible and Open Source:** The bot's code is written in JavaScript and provided as open source, allowing developers to contribute and build upon its functionality.

## Requirements

- Node.js v16 or higher
- 100MB Or More of Storage Space
- VPS Server (Optional)

## Installation

1. Clone this repository to your local machine.

2. Install the required dependencies by running the following command in your terminal:

```
npm install
```

## Configuration

Before running the bot, you need to configure the `config.json` file with the appropriate settings:

```json
{
  "clientId": "THE_BOT_CLIENT_ID",
  "footerText": "YOUR_FOOTER_TEXT",
  "maintenanceMode": false,
  "statusText": "Made By RXNationGaming",
  "port": 3000,
  "expressServerEnabled": true,
  "apiUrl": "https://api.pawan.krd/gtranslate",
  "apiUrlWarning": "WARNING: Do not modify the API URL unless you know what you are doing! This can cause unexpected behavior and break the bot's functionality. | Optional Link For API: https://api.pawan.krd/mtranslate (Recommended & Offers Almost All Of It's Languages)"
}
```

`.env`
```json
DISCORD_TOKEN=YOUR_TOKEN
```

Make sure to replace `YOUR_TOKEN` and `THE_BOT_CLIENT_ID` with your bot's actual token and client ID.

## Usage

Once the bot is installed and configured, run the following command to start the bot:

```
node index.js
```

After starting the bot, it will be active on your Discord server, and users can start translating text using the provided commands.

To translate a message, simply use the slash command `/translate` followed by the message you want to translate, like this:

```
/translate text: Hello, how are you? to: Japanese
```

Output:

![RXTranslator Logo](https://media.discordapp.net/attachments/889544904236224622/1140828141254881370/image.png))

The bot will automatically detect the language and provide the translation.

For a full list of available commands and their usage, type `/help` in any channel where the bot is active.

## Code Claiming

This code is solely made by RXNationGaming. Any unauthorized use, distribution, or claiming of this code as someone else's work is strictly prohibited.

## Invite Our Bot

If you don't want to self-host it by yourself, you can invite our Discord Bot here :

[Invite Our Bot Here](https://discord.com/api/oauth2/authorize?client_id=824202332992045056&permissions=2147601408&scope=bot%20applications.commands)

## Support and Community

For questions, feedback, bug reports, or general discussions related to RXTranslator, join our dedicated support server:

[Click Here](https://discord.gg/2wPQv5NcHD)

Our friendly community and developers are there to help and make your experience with RXTranslator enjoyable.

## Contributing

We welcome contributions to improve RXTranslator! If you have any feature suggestions, bug fixes, or improvements, feel free to open an issue or submit a pull request on our GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
