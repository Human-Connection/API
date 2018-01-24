// users-candos-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const usersCandos = new mongooseClient.Schema({
    userId: { type: String, required: true },
    contributionId: { type: String, required: true },
    done: { type: Boolean, default: false },
    doneAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  usersCandos.index(
    { userId: 1, contributionId: 1 },
    { unique: true }
  );

  usersCandos.index(
    { userId: 1 }
  );

  usersCandos.index(
    { contributionId: 1 }
  );

  return mongooseClient.model('usersCandos', usersCandos);
};
