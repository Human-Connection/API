// usersettings-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const usersettings = new mongooseClient.Schema({
    userId: {type: String, required: true, unique: true},
    uiLanguage: {type: String, required: true, default: 'de'},
    contentLanguages: {type: Array, default: ['de']},
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('usersettings', usersettings);
};
