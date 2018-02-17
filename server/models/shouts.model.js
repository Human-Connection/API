// users-shouts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const shouts = new mongooseClient.Schema({
    userId: { type: String, required: true, index: true },
    foreignId: { type: String, required: true, index: true },
    foreignService: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  shouts.index(
    { userId: 1, foreignId: 1 },
    { unique: true }
  );

  return mongooseClient.model('shouts', shouts);
};
