const express = require('express');
const app = express();

/**
 * Start the Express server on the specified port
 * @param {number} port - The port number to start the server on
 */
function startExpressServer(port) {
  app.get('/', (req, res) => {
    res.send('This Code Is Made From <a href="https://github.com/RXNationGMG">RXNationGaming</a>');
  });

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

/**
 * Initialize and start the Express server based on the provided configuration
 * @param {object} config - The configuration object
 */
module.exports = (config) => {
  if (config.expressServerEnabled) {
    startExpressServer(config.port);
  }
};
