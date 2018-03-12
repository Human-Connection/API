// invites-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const invites = new mongooseClient.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'manager', 'editor', 'user'],
      default: 'user'
    },
    language: { type: String },
    badgeIds: [],
    wasUsed: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    wasSeeded: { type: Boolean }
  });

  return mongooseClient.model('invites', invites);
};
