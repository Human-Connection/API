/* eslint-disable no-console */
const app = require('./app');
const port = app.get('port');
const host = app.get('host');

process.on('unhandledRejection', function (err) {
  throw err;
});

process.on('uncaughtException', function (err) {
  app.error(err);
});

// Start server
const server = app.listen(port, host);
server.on('listening', () => {
  // Start seeder, after database is setup
  if (app.get('seeder').runOnInit === true) {
    app.on('mongooseInit', () => {
      app.service('users').find({ query: { $limit: 0 }})
        .then(async (res) => {
          app.debug(res);
          if (res.total > 0) {
            return null;
          }
          app.info(`Feathers application started on ${app.get('host')}:${port}`);
          app.info('>>>>>> RUN SEEDER <<<<<<');
          await app.seed();
        });
    });
  } else {
    app.service('categories').find({ query: { $limit: 0 }})
      .then(async (res) => {
        if (res.total < 1) {
          app.service('admin').create({ seedBaseCategories: true });
        }
      });
    app.service('badges').find({ query: { $limit: 0 }})
      .then(async (res) => {
        if (res.total < 1) {
          app.service('admin').create({ seedBaseBadges: true });
        }
      });
    app.info(`Feathers application started on ${app.get('host')}:${port}`);
  }
});
