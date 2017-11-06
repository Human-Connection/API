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
