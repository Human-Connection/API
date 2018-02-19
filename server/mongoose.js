const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');

module.exports = function () {
  const app = this;

  mongoose.connect(app.get('mongodb'), {
    useMongoClient: true,
    autoReconnect: true,
    keepAlive: 1,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000
  }, function () {
    if (process.NODE_ENV !== 'production' && app.get('seeder').dropDatabase === true) {
      mongoose.connection.dropDatabase().then(() => {
        app.debug('>>>>>> DROPED DATABASE <<<<<<');
        let uploadDir = path.resolve('public/uploads');
        if (fs.existsSync(uploadDir)) {
          app.debug('Remove the upload directory');
          fs.removeSync(uploadDir);
        }
        app.emit('mongooseInit');
      });
    } else {
      app.emit('mongooseInit');
    }
  });
  mongoose.Promise = global.Promise;
  app.set('mongooseClient', mongoose);
};
