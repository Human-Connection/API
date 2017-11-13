const mongoose = require('mongoose');

module.exports = function () {
  const app = this;

  mongoose.connect(app.get('mongodb'), {
    useMongoClient: true,
    server: {
      auto_reconnect: true,
      socketOptions: {
        keepAlive: 1
      }
    }
  }, function () {
    if (app.get('seeder').dropDatabase === true) {
      mongoose.connection.dropDatabase().then(() => {
        app.debug('>>>>>> DROPED DATABASE <<<<<<');
        app.emit('mongooseInit');
      });
    } else {
      app.emit('mongooseInit');
    }
  });
  mongoose.Promise = global.Promise;
  app.set('mongooseClient', mongoose);
};
