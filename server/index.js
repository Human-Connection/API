/* eslint-disable no-console */
const logger = require('winston');
const fs = require('fs-extra');
const path = require('path');

// setup local env is not available
let configDir = path.resolve('config');
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(configDir + '/local.json')) {
  fs.copySync(configDir + '/local.example.json', configDir + '/local.json');
}

const app = require('./app');
const port = app.get('port');

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

// Start server
const server = app.listen(port);
server.on('listening', () => {
  // Start seeder, after database is setup
  if (app.get('seeder').runOnInit === true) {
    app.on('mongooseInit', () => {
      app.service('users').find({ query: { $limit: 0 }})
        .then(res => {
          console.log(res);
          if (res.total > 0) {
            return null;
          }
          console.log('>>>>>> RUN SEEDER <<<<<<');
          app.seed()
            .then(() => {
              logger.info(`Feathers application started on ${app.get('host')}:${port}`);
            })
            .catch((e) => {
              logger.error(e);
            });
      });
    });
  }
});
