// users-follows-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const follows = new mongooseClient.Schema({
    userId: { type: String, required: true, index: true },
    foreignId: { type: String, required: true, index: true },
    foreignService: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  follows.index(
    { userId: 1, foreignId: 1, foreignService: 1 },
    { unique: true }
  );

  return mongooseClient.model('follows', follows);
};
