/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');


process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

// Start server
const server = app.listen(port);
server.on('listening', () => {
  // Start seeder, after database is setup
  const rethinkInit = app.get('rethinkInit');
  rethinkInit
    .then(() => app.seed()
      .then(() => logger.info(`Feathers application started on ${app.get('host')}:${port}`)));

});