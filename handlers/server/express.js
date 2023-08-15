const express = require('express');
const app = express();

function startExpressServer(port) {
  app.get('/', (req, res) => {
    res.send('This Code Is Made From <a href="https://github.com/RXNationGMG">RXNationGaming</a>');
  });

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

module.exports = (config) => {
  if (config.expressServerEnabled) {
    startExpressServer(config.port);
  }
};
