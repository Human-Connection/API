// emotions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const emotions = new mongooseClient.Schema({
    userId: { type: String, required: true },
    contributionId: { type: String, required: true },
    rated: {
      type: String,
      required: true,
      enum: ['funny', 'happy', 'surprised', 'cry', 'angry']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('emotions', emotions);
};
