const mongoose = require('mongoose');

module.exports = function () {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;
  app.set('mongooseClient', mongoose);

  // Create a fresh database for development
  if(process.env.NODE_ENV === 'development') {
    mongoose.connection.dropDatabase().then(() => {
      app.emit('mongooseInit');
    });
  } else {
    app.emit('mongooseInit');
  }
};
