// status-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const status = new mongooseClient.Schema({
    maintenance: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('status', status);
};
