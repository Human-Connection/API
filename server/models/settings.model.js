// settings-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const settings = new Schema({
    key: {type: String, default: 'system', index: true, unique: true},
    invites: {
      userCanInvite: { type: Boolean, required: true, default: false },
      maxInvitesByUser: { type: Number, required: true, default: 1 },
      onlyUserWithBadgesCanInvite: { type: Array, default: [] }
    },
    maintenance: false
  }, {
    timestamps: true
  });

  return mongooseClient.model('settings', settings);
};
