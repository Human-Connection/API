/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = app.get('port');


process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

app.seed().then(() => {
  const server = app.listen(port);
  server.on('listening', () =>
    logger.info(`Feathers application started on ${app.get('host')}:${port}`)
  );
}).catch(err => {
  logger.error('Seeder error ', err);
});


