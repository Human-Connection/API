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
  });
  mongoose.Promise = global.Promise;

  app.set('mongooseClient', mongoose);
};
